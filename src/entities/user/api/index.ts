import { client } from "@/shared/api/client";

export const UserAPI = {
  async getAll() {
    const res = await client.get("/users");
    return res.data;
  },

  async getById(id: string) {
    const res = await client.get(`/users/${id}`);
    return res.data;
  },

  async create(user: { name: string; email: string; role: "USER" | "ADMIN" }) {
    const res = await client.post("/users", user);
    return res.data;
  },

  async update(
    id: string,
    user: { name?: string; email?: string; role?: "USER" | "ADMIN" }
  ) {
    const res = await client.put(`/users/${id}`, user);
    return res.data;
  },

  async delete(id: string) {
    const res = await client.delete(`/users/${id}`);
    return res.data;
  },
};
