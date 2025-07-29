export interface CreateUserDto {
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: "USER" | "ADMIN";
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  created_at: string;
}
