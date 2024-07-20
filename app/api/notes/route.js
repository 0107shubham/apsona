import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  const { title, content, userId, backgroundColor, archived, tags } =
    await req.json();

  try {
    const note = await prisma.note.create({
      data: {
        title,
        content,
        backgroundColor: backgroundColor || "white",
        archived: archived || false,
        userId: parseInt(userId),
        tags: {
          create: tags.map((tag) => ({
            tag: {
              connectOrCreate: {
                where: { name: tag },
                create: { name: tag },
              },
            },
          })),
        },
      },
      include: {
        tags: true,
      },
    });
    return NextResponse.json({
      status: 201,
      message: "Note created successfully",
      data: note,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Note creation failed" },
      { status: 400 }
    );
  }
}

export async function PUT(req) {
  const { title, content, id, backgroundColor, archived } = await req.json();

  try {
    const note = await prisma.note.update({
      where: {
        id,
      },
      data: {
        title,
        content,
        backgroundColor: backgroundColor,
        archived: archived,
      },
      include: {
        tags: true,
      },
    });
    return NextResponse.json({
      status: 200,
      message: "Note updated successfully",
      data: note,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Note update failed" }, { status: 400 });
  }
}
