function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

export const env = {
  get databaseUrl() {
    return required("DATABASE_URL");
  },
  get authSecret() {
    return required("AUTH_SECRET");
  },
  get authUrl() {
    return optional("AUTH_URL") ?? "http://localhost:3000";
  },
  get resendApiKey() {
    return required("RESEND_API_KEY");
  },
  get emailFrom() {
    return optional("EMAIL_FROM") ?? "R.A.T.S. <onboarding@resend.dev>";
  },
  get steamApiKey() {
    return optional("STEAM_API_KEY");
  },
  get epicClientId() {
    return required("EPIC_CLIENT_ID");
  },
  get epicClientSecret() {
    return required("EPIC_CLIENT_SECRET");
  },
  get microsoftClientId() {
    return required("MICROSOFT_CLIENT_ID");
  },
  get microsoftClientSecret() {
    return required("MICROSOFT_CLIENT_SECRET");
  }
};
