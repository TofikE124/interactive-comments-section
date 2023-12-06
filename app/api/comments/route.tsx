import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { commentSchema } from "../validationSchema";
import { getServerSession } from "next-auth";
import { Comment, User, Vote } from "@prisma/client";

export async function GET(request: NextRequest) {
  const comments = await prisma?.comment.findMany();
  return NextResponse.json(comments);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  const body = await request.json();
  const validation = commentSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  if (!session?.user)
    return NextResponse.json({ message: "Invalid request" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });

  const newComment = await prisma.comment.create({
    data: {
      content: body.content,
      parent_id: body.parentId ? parseInt(body.parentId) : null,
      publisherId: user?.id!,
    },
  });

  return NextResponse.json(newComment);
}

export type CommentWithPublisher = { publisher: User; votes: Vote[] } & Comment;
export type CommentWithReplies = {
  children: Comment[];
  votes: Vote[];
} & Comment;
export type CommentWithPublisherAndReplies = CommentWithReplies &
  CommentWithPublisher;
