import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { commentSchema } from "../../validationSchema";
import { getServerSession } from "next-auth";
interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params: { id } }: Props) {
  const comment = await prisma.comment.findUnique({
    where: { id: parseInt(id) },
  });
  if (!comment)
    return NextResponse.json({ message: "Comment not found" }, { status: 404 });
  return NextResponse.json(comment);
}

export async function PATCH(request: NextRequest, { params: { id } }: Props) {
  const session = await getServerSession();

  const body = await request.json();
  const validation = commentSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const comment = await prisma.comment.findUnique({
    where: { id: parseInt(id) },
    include: { publisher: true },
  });
  if (!comment)
    return NextResponse.json({ message: "Comment not found" }, { status: 404 });

  if (session?.user?.email !== comment.publisher.email)
    return NextResponse.json("You can't do that", { status: 401 });
  const newComment = await prisma.comment.update({
    where: { id: parseInt(id) },
    data: { content: body.content },
  });

  return NextResponse.json(newComment);
}

export async function DELETE(request: NextRequest, { params: { id } }: Props) {
  const session = await getServerSession();

  const comment = await prisma.comment.findUnique({
    where: { id: parseInt(id) },
    include: { publisher: true },
  });
  if (!comment)
    return NextResponse.json({ message: "Comment not found" }, { status: 404 });
  if (session?.user?.email !== comment.publisher.email)
    return NextResponse.json("You can't do that", { status: 401 });

  await prisma.comment.delete({ where: { id: parseInt(id) } });

  return NextResponse.json(
    { message: `Comment with id of ${id} was deleted` },
    { status: 200 }
  );
}
