export interface UserSession {
  email: string;
  name: string;
  role: string;
  loginTime: string;
}

export const ALLOWED_USERS = [
  {
    email: 'evren@uno-dmc.cz',
    password: 'FenerliDerya@1907',
    name: 'Evren',
    role: 'Administrator'
  },
  {
    email: 'gersencelebi@gmail.com',
    password: 'FenerliErsen@1907',
    name: 'G. Ersen Çelebi',
    role: 'Administrator'
  }
];

const AUTH_KEY = 'uno_erp_user_session';

export function authenticateUser(emailInput: string, passwordInput: string): { success: boolean; user?: UserSession; error?: string } {
  const emailClean = emailInput.trim().toLowerCase();
  const passClean = passwordInput.trim();

  const found = ALLOWED_USERS.find(
    u => (u.email.toLowerCase() === emailClean || u.email.split('@')[0].toLowerCase() === emailClean) && u.password === passClean
  );

  if (!found) {
    return {
      success: false,
      error: 'Invalid username or password. Please check your credentials.'
    };
  }

  const session: UserSession = {
    email: found.email,
    name: found.name,
    role: found.role,
    loginTime: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    document.cookie = `uno_session=1; path=/; max-age=86400`;
  }

  return { success: true, user: session };
}

export function getCurrentUser(): UserSession | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as UserSession;
  } catch {
    return null;
  }
}

export function logoutUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
    document.cookie = `uno_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
