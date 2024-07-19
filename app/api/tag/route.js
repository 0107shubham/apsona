import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  const { noteId, tagId, name } = await req.json();

  const tagData = await prisma.tag.create({
    data: {
      name,
    },
  });
  console.log(tagData);

  const newNoteTag = await prisma.noteTag.create({
    data: {
      noteId,
      tagId: tagData.id,
    },
  });
  return Response.json({
    message: "i m working dont worry",
    data: tagData,
  });
}

export async function PUT(req) {
  const { noteId, tagId, name } = await req.json();

  const tagData = await prisma.tag.update({
    where: {
      id: tagId,
    },
    data: {
      name,
    },
  });
  console.log(tagData);

  return Response.json({
    message: "i m working dont worry",
    data: tagData,
  });
}

export async function DELETE(req) {
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
