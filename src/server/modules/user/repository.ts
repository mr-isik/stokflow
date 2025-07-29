import { supabase } from "@/shared/lib/db";
import { CreateUserDto, UpdateUserDto } from "./dto";

export const UserRepository = {
  async findAll() {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async findById(id: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async create(user: CreateUserDto) {
    const { data, error } = await supabase.from("users").insert(user).single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async update(id: string, user: UpdateUserDto) {
    const { data, error } = await supabase
      .from("users")
      .update(user)
      .eq("id", id)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async delete(id: string) {
    const { data, error } = await supabase.from("users").delete().eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
};
