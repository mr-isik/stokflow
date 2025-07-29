import { NextRequest } from "next/server";
import { UserService } from "./service";

export const getAllUsers = async () => {
  return UserService.getAll();
};

export const getUserById = async (id: string) => {
  return UserService.getById(id);
};

export const createUser = async (req: NextRequest) => {
  const body = await req.json();
  return UserService.create(body);
};

export const updateUser = async (req: NextRequest, id: string) => {
  const body = await req.json();
  return UserService.update(id, body);
};

export const deleteUser = async (id: string) => {
  return UserService.delete(id);
};
