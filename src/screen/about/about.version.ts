export const UNKNOWN_VERSION = '—';

// App version comes from app.json (expoConfig.version); never render an empty value.
export function resolveAppVersion(version: string | null | undefined): string {
  const trimmed = version?.trim();
  return trimmed ? trimmed : UNKNOWN_VERSION;
}
