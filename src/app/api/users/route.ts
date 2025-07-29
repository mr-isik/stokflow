import { createUser, getAllUsers } from "@/server/modules/user/controller";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const data = await getAllUsers();
    return Response.json(data, {
      status: 200,
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await createUser(request);
    return Response.json(user, {
      status: 201,
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}
