import { CreateUserDto, UpdateUserDto } from "./dto";
import { UserRepository } from "./repository";

export const UserService = {
  async getAll() {
    return await UserRepository.findAll();
  },

  async getById(id: string) {
    return await UserRepository.findById(id);
  },

  async create(user: CreateUserDto) {
    return await UserRepository.create(user);
  },

  async update(id: string, user: UpdateUserDto) {
    return await UserRepository.update(id, user);
  },

  async delete(id: string) {
    return await UserRepository.delete(id);
  },
};
