// Small class-name join helper (avoids an extra dependency).
export function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}
