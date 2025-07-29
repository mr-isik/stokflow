import {
  deleteUser,
  getUserById,
  updateUser,
} from "@/server/modules/user/controller";
import { NextRequest } from "next/server";

export async function GET({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const data = await getUserById(id);
    if (!data) {
      return Response.json(
        { message: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Kullanıcı bilgileri alınırken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const user = await request.json();
    const updatedUser = await updateUser(request, id);
    return Response.json(updatedUser, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Kullanıcı güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    await deleteUser(id);
    return Response.json({ message: "Kullanıcı silindi." }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Kullanıcı silinirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
