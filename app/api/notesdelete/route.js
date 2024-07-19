import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  const { id } = await req.json();

  try {
    // const data = await prisma.noteTag.findMany({
    //   where: {
    //     noteId: id,
    //   },
    // });
    await prisma.noteTag.deleteMany({
      where: {
        noteId: id,
      },
    });
    const note = await prisma.note.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      status: 201,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Note deletion failed" },
      { status: 400 }
    );
  }
}
