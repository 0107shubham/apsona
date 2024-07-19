import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function POST(req) {
  const { noteId, tagId } = await req.json();

  await prisma.noteTag.deleteMany({
    where: { tagId },
  });

  await prisma.tag.delete({
    where: {
      id: tagId,
    },
  });

  return Response.json({
    message: "i m working dont worry,i have deleted the tag",
  });
}