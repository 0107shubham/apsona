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
        userId,
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
export async function DELETE(req, { params }) {
  const id = parseInt(params.id, 10);

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

// export async function GET(req) {
//   const data = await prisma.user.findUnique({
//     where: {
//       id: 1,
//     },
//     include: {
//       notes: {
//         include: {
//           tags: {
//             include: {
//               tag: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   return Response.json({ message: "success", data: data });
// }
