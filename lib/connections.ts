import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db, schema } from "@/db";
import type { ConnectionProvider } from "@/db/schema";
import { generateOpaqueToken } from "./auth-utils";
import { env } from "./env";

const STATE_COOKIE_PREFIX = "rats_oauth_state_";
const STATE_COOKIE_TTL_SECONDS = 600;

export type ProviderId = ConnectionProvider;

export function callbackUrl(path: string): string {
  return `${env.authUrl.replace(/\/$/, "")}${path}`;
}

export async function issueState(provider: ProviderId): Promise<string> {
  const state = generateOpaqueToken(24);
  const jar = await cookies();
  jar.set(`${STATE_COOKIE_PREFIX}${provider}`, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.authUrl.startsWith("https://"),
    path: "/",
    maxAge: STATE_COOKIE_TTL_SECONDS
  });
  return state;
}

export async function consumeState(
  provider: ProviderId,
  received: string | null
): Promise<boolean> {
  if (!received) return false;
  const jar = await cookies();
  const cookieName = `${STATE_COOKIE_PREFIX}${provider}`;
  const stored = jar.get(cookieName)?.value;
  jar.delete(cookieName);
  return Boolean(stored && stored === received);
}

export async function upsertConnection(opts: {
  userId: string;
  provider: ProviderId;
  providerAccountId: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  verified?: boolean;
}): Promise<void> {
  const existing = await db
    .select({ id: schema.connectedAccounts.id })
    .from(schema.connectedAccounts)
    .where(
      and(
        eq(schema.connectedAccounts.userId, opts.userId),
        eq(schema.connectedAccounts.provider, opts.provider)
      )
    )
    .limit(1);

  if (existing[0]) {
    await db
      .update(schema.connectedAccounts)
      .set({
        providerAccountId: opts.providerAccountId,
        displayName: opts.displayName ?? null,
        avatarUrl: opts.avatarUrl ?? null,
        verified: opts.verified === false ? 0 : 1,
        linkedAt: new Date()
      })
      .where(eq(schema.connectedAccounts.id, existing[0].id));
    return;
  }

  await db.insert(schema.connectedAccounts).values({
    userId: opts.userId,
    provider: opts.provider,
    providerAccountId: opts.providerAccountId,
    displayName: opts.displayName ?? null,
    avatarUrl: opts.avatarUrl ?? null,
    verified: opts.verified === false ? 0 : 1
  });
}

export async function listConnections(userId: string) {
  return db
    .select()
    .from(schema.connectedAccounts)
    .where(eq(schema.connectedAccounts.userId, userId));
}

export async function disconnect(userId: string, provider: ProviderId): Promise<void> {
  await db
    .delete(schema.connectedAccounts)
    .where(
      and(
        eq(schema.connectedAccounts.userId, userId),
        eq(schema.connectedAccounts.provider, provider)
      )
    );
}

export const ALL_PROVIDERS: ReadonlyArray<ProviderId> = [
  "steam",
  "epic",
  "xbox",
  "playstation"
];

export function isProvider(value: string): value is ProviderId {
  return (ALL_PROVIDERS as readonly string[]).includes(value);
}
