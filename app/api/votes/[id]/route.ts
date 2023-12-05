import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { updateVoteSchema } from "../../validationSchema";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params: { id } }: Props) {
  const body = await request.json();
  const session = await getServerSession();

  const validation = updateVoteSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  if (!session?.user)
    return NextResponse.json({ message: "Invalid request" }, { status: 401 });

  const user = await prisma?.user.findUnique({
    where: { email: session.user.email! },
  });

  const vote = await prisma?.vote.findUnique({
    where: { id: parseInt(id) },
  });

  if (!vote)
    return NextResponse.json({ message: "Vote not found" }, { status: 404 });

  if (vote.userId !== user?.id)
    return NextResponse.json({ message: "You can't change others vote" });

  const updatedVote = await prisma?.vote.update({
    where: { id: parseInt(id) },
    data: {
      type: body.voteType,
    },
  });

  return NextResponse.json(updatedVote);
}
