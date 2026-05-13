import Link from "next/link";

function MeepleIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="16" cy="8" r="4.2" />
      <path d="M16 12.5c-3 0-5 1.4-6.4 2.6L4 19.4c-.6.4-.6 1.3-.1 1.8l1.3 1.3c.5.5 1.3.5 1.8 0L11 18.5V28c0 .8.6 1.4 1.4 1.4h2.1c.6 0 1-.4 1-1V23h1V28.4c0 .6.4 1 1 1h2.1c.8 0 1.4-.6 1.4-1.4V18.5l4 4c.5.5 1.3.5 1.8 0l1.3-1.3c.5-.5.5-1.4-.1-1.8l-5.6-4.3c-1.4-1.2-3.4-2.6-6.4-2.6z" />
    </svg>
  );
}

export default function ProfileButton({
  avatarUrl
}: {
  avatarUrl: string | null;
}) {
  return (
    <Link href="/account" className="profile-button" aria-label="Account overview">
      {avatarUrl ? (
        // The avatar is a tiny external image; next/image isn't worth its config here.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt="" className="profile-button__avatar" />
      ) : (
        <span className="profile-button__icon">
          <MeepleIcon />
        </span>
      )}
    </Link>
  );
}
