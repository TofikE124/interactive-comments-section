import { NextRequest, NextResponse } from "next/server";
import { createVoteSchema, updateVoteSchema } from "../validationSchema";
import { getServerSession } from "next-auth";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const session = await getServerSession();

  const validation = createVoteSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  if (!session?.user)
    return NextResponse.json({ message: "Invalid request" }, { status: 401 });

  const comment = await prisma?.comment.findUnique({
    where: { id: parseInt(body.commentId) },
  });

  if (!comment)
    return NextResponse.json({ message: "Comment not found" }, { status: 404 });

  const user = await prisma?.user.findUnique({
    where: { email: session.user.email! },
  });

  const vote = await prisma?.vote.create({
    data: {
      type: body.voteType,
      commentId: comment.id,
      userId: user?.id!,
    },
  });

  return NextResponse.json(vote);
}
