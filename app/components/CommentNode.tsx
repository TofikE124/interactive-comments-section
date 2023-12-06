import { TreeNode } from "@/prisma/tree";
import React from "react";
import { CommentWithPublisherAndReplies } from "../api/comments/route";
import CommentCard from "./CommentCard";
import { getServerSession } from "next-auth";

const CommentNode = async ({
  commentNode,
}: {
  commentNode: TreeNode<CommentWithPublisherAndReplies>[];
}) => {
  const session = await getServerSession();
  const user = await prisma?.user.findUnique({
    where: { email: session?.user?.email! },
  });

  if (commentNode.length === 1 && !commentNode[0].parent) {
    return (
      <>
        <CommentCard
          comment={commentNode[0].value}
          path={commentNode[0].path}
          currentUserId={user?.id!}
        />
        {commentNode[0].children.length ? (
          <div className="comment-children">
            <CommentNode commentNode={commentNode[0].children} />
          </div>
        ) : (
          ""
        )}
      </>
    );
  } else {
    return commentNode.map((commentBlob) => {
      return (
        <>
          <CommentCard
            comment={commentBlob.value}
            path={commentBlob.path}
            parentPath={commentBlob.parent?.path}
            currentUserId={user?.id!}
          />
          {commentBlob.children[0] ? (
            <div className="comment-children">
              <CommentNode commentNode={commentBlob.children} />
            </div>
          ) : (
            ""
          )}
        </>
      );
    });
  }
};

export default CommentNode;
