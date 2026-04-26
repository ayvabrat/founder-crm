export class RateLimiter {
  private requests = new Map<string, number[]>();

  canMakeRequest(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const history = this.requests.get(key) ?? [];
    const active = history.filter((timestamp) => now - timestamp < windowMs);

    if (active.length >= maxRequests) {
      this.requests.set(key, active);
      return false;
    }

    active.push(now);
    this.requests.set(key, active);
    return true;
  }
}

export const rateLimiter = new RateLimiter();

