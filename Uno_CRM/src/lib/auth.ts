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
  },
  {
    email: 'tuana@uno-dmc.cz',
    password: 'medCezir@1993',
    name: 'Tuana',
    role: 'Administrator'
  },
  {
    email: 'deniz.evren@uno-dmc.cz',
    password: 'FenerliDeniz@1907',
    name: 'Deniz Evren',
    role: 'Administrator'
  }
];

const AUTH_KEY = 'uno_erp_user_session';

export async function authenticateUserAsync(emailInput: string, passwordInput: string): Promise<{ success: boolean; user?: UserSession; error?: string }> {
  try {
    const res = await fetch('http://localhost:8001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput, password: passwordInput })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        const session: UserSession = {
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          loginTime: data.user.loginTime || new Date().toISOString()
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_KEY, JSON.stringify(session));
          document.cookie = `uno_session=1; path=/; max-age=86400`;
        }
        return { success: true, user: session };
      }
    }
  } catch (err) {
    console.warn('Backend DB auth offline, falling back to local user store:', err);
  }

  // Fallback to local store
  return authenticateUser(emailInput, passwordInput);
}

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
