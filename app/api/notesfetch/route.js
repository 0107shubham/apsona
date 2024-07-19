import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  const { userId } = await req.json();
  console.log("userid hhh", userId);
  const data = await prisma.user.findMany({
    where: {
      id: parseInt(userId),
    },
    include: {
      notes: {
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      },
    },
  });

  return Response.json({ message: "success", data: data });
}
