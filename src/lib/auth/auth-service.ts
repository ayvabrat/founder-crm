import { SecureStorage } from "@/lib/security/encryption";

const MASTER_PASSWORD = "suggy1488";
const AUTH_KEY = "founder_crm_auth";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

type AuthSession = {
  authenticated: boolean;
  expiresAt: number;
};

export class AuthService {
  static async login(password: string): Promise<boolean> {
    if (password !== MASTER_PASSWORD) return false;
    const payload: AuthSession = {
      authenticated: true,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };
    const encrypted = await SecureStorage.encrypt(JSON.stringify(payload));
    localStorage.setItem(AUTH_KEY, encrypted);
    return true;
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      const encrypted = localStorage.getItem(AUTH_KEY);
      if (!encrypted) return false;
      const decrypted = await SecureStorage.decrypt(encrypted);
      const payload = JSON.parse(decrypted) as AuthSession;
      if (!payload.authenticated || payload.expiresAt < Date.now()) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  static logout(): void {
    localStorage.removeItem(AUTH_KEY);
  }
}

