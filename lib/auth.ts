// lib/auth.ts
import { sha256 } from "js-sha256";

export interface User {
  username: string;
  passwordHash: string;
  role: string;
}

const USERS: User[] = [
  {
    username: "Vivek",
    passwordHash: "011d986ce28f594819af01f9374a7bd9dbb9983d0f32d0bf3a16c540b3ea96ac",
    role: "user",
  },
  {
    username: "Mohammed Rishard",
    passwordHash: "13464d284f37e626c2abd161796944827932e844d4b60b8b9f2d5eb17aeefe21",
    role: "user",
  },
  {
    username: "Nidhin",
    passwordHash: "18dc07af65206a43a690916a9692d13e14a40fa42e7c6491ecfb8aa661f6af73",
    role: "user",
  },
];

const SESSION_KEY = "sales_dashboard_session";

export function hashPassword(password: string): string {
  return sha256(password);
}

export function authenticateUser(username: string, password: string): User | null {
  const hashedPassword = hashPassword(password);
  const user = USERS.find(
    (u) => u.username === username && u.passwordHash === hashedPassword
  );
  return user || null;
}

export function saveSession(user: User): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }
}

export function getSession(): User | null {
  if (typeof window !== "undefined") {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }
  return null;
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}