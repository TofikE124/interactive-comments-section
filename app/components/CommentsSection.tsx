import prisma from "@/prisma/client";
import CommentCard from "./CommentCard";
import { CommentWithPublisher } from "../api/comments/route";
import { TreeNode } from "@/prisma/tree";
import CommentNode from "./CommentNode";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import ScrollToBottom from "./ScrollToBottom";

interface Props {
  commentsId: string[];
}

async function getCommentNode(
  commentsId: string[]
): Promise<TreeNode<CommentWithPublisher> | null> {
  let commentNode: TreeNode<CommentWithPublisher> | null = null;

  if (commentsId?.length) {
    let commentsParent = await prisma.comment.findUnique({
      where: { id: Number(commentsId[0]) },
      include: { publisher: true },
    });

    commentNode = new TreeNode(
      null,
      commentsParent!,
      commentsParent?.id.toString()!
    );
    let currentParent: TreeNode<CommentWithPublisher> | null = commentNode;
    for (let i = 0; i < commentsId?.length; i++) {
      const comments = await prisma.comment.findMany({
        where: { parent_id: Number(commentsId[i]) },
        include: { publisher: true },
        orderBy: { createdAt: "desc" },
      });
      let nextParent: TreeNode<CommentWithPublisher> | null = null;

      comments.map((comment) => {
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
  const comments = await prisma.comment.findMany({
    where: { parent_id: null },
    orderBy: { createdAt: "asc" },
    include: { publisher: true },
  });
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

  return (
    <div className="comments-container ">
      {comments.map((comment) => {
        return (
          <CommentCard
            key={comment.id}
            comment={comment}
            path={comment.id.toString()}
          />
        );
      })}
      <ScrollToBottom />
    </div>
  );
};

export default CommentsSection;
