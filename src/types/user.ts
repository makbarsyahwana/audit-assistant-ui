export type UserRole =
  | "admin"
  | "audit_manager"
  | "auditor"
  | "control_owner"
  | "compliance";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  user: User;
  accessToken: string;
  expiresAt: string;
}
