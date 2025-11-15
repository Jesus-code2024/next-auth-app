import bcrypt from "bcryptjs";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

// In-memory user list (replace with DB in production)
const users: StoredUser[] = [];

export function findUserByEmail(email: string): StoredUser | undefined {
  return users.find((u) => u.email === email.toLowerCase());
}

export async function createUser(name: string, email: string, password: string): Promise<StoredUser> {
  const existing = findUserByEmail(email);
  if (existing) throw new Error("Email ya registrado");
  const passwordHash = await bcrypt.hash(password, 10);
  const user: StoredUser = { id: crypto.randomUUID(), name, email: email.toLowerCase(), passwordHash };
  users.push(user);
  return user;
}

export async function verifyPassword(user: StoredUser, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}

export function listUsers(): StoredUser[] { return users; }
