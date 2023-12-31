import prisma from "@/prisma/client";
import CommentCard from "./CommentCard";
import {
  CommentWithPublisher,
  CommentWithPublisherAndReplies,
} from "../api/comments/route";
import { TreeNode } from "@/prisma/tree";
import CommentNode from "./CommentNode";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import ScrollToBottom from "./ScrollToBottom";
import { getServerSession } from "next-auth";
import { userAgent } from "next/server";
import { User } from "@prisma/client";

interface Props {
  commentsId: string[];
}

async function getCommentNode(
  commentsId: string[]
): Promise<TreeNode<CommentWithPublisherAndReplies> | null> {
  let commentNode: TreeNode<CommentWithPublisherAndReplies> | null = null;

  if (Array.isArray(commentsId) && commentsId[0].length > 8) return null;

  if (commentsId?.length) {
    let commentsParent = await prisma.comment.findUnique({
      where: { id: Number(commentsId[0]) },
      include: { publisher: true, votes: true, children: true },
    });
    if (!commentsParent) return null;

    commentNode = new TreeNode<CommentWithPublisherAndReplies>(
      null,
      commentsParent!,
      commentsParent?.id.toString()!
    );
    let currentParent: TreeNode<CommentWithPublisherAndReplies> | null =
      commentNode;
    for (let i = 0; i < commentsId?.length; i++) {
      const comments = await prisma.comment.findMany({
        where: { parent_id: Number(commentsId[i]) },
        include: { publisher: true, votes: true, children: true },
        orderBy: { createdAt: "desc" },
      });
      let nextParent: TreeNode<CommentWithPublisherAndReplies> | null = null;

      comments?.map((comment) => {
        const child = new TreeNode(
          currentParent,
          comment,
          comment.id.toString()
        );
        child.parent = currentParent;
        if (i < commentsId.length - 1) {
          if (child.value.id.toString() === commentsId[i + 1]) {
            nextParent = child;
          }
        }
      });
      currentParent = nextParent;
    }
  }
  return commentNode;
}

const CommentsSection = async ({ commentsId }: Props) => {
  const commentNode = await getCommentNode(commentsId);

  if (commentNode && commentsId) {
    return (
      <div className="comments-container">
        <Link href="/comments" className="back-btn">
          <ArrowLeftIcon />
        </Link>
        <CommentNode commentNode={[commentNode]} />
        <ScrollToBottom />
      </div>
    );
  }
  const comments = await prisma.comment.findMany({
    where: { parent_id: null },
    orderBy: { createdAt: "asc" },
    include: { votes: true, children: true, publisher: true },
  });

  const session = await getServerSession();
  let user: User | null = null;
  if (session) {
    user = await prisma.user.findUnique({
      where: { email: session?.user?.email! },
    });
  }

  return (
    <div className="comments-container ">
      {comments?.map((comment) => {
        return (
          <CommentCard
            key={comment.id}
            comment={comment}
            currentUserId={user?.id.toString() || null}
            path={comment.id.toString()}
          />
        );
      })}
      <ScrollToBottom comments={comments} />
    </div>
  );
};

export default CommentsSection;
