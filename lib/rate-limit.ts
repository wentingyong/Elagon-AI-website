const windowMs = 10 * 60 * 1000;
const maxRequests = 5;
const attempts = new Map<string, number[]>();

export function allowRequest(identifier: string) {
  const now = Date.now();
  const active = (attempts.get(identifier) || []).filter((timestamp) => now - timestamp < windowMs);
  if (active.length >= maxRequests) return false;
  active.push(now);
  attempts.set(identifier, active);
  return true;
}
