import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req, res) {
  const { email, password, name } = await req.json();

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });
    return Response.json({ status: "user registered", data: user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "User creation failed", error: error.message });
  }
}
