import { TreeNode } from "@/prisma/tree";
import React from "react";
import { CommentWithPublisher } from "../api/comments/route";
import CommentCard from "./CommentCard";

const CommentNode = ({
  commentNode,
}: {
  commentNode: TreeNode<CommentWithPublisher>[];
}) => {
  if (commentNode.length === 1 && !commentNode[0].parent) {
    return (
      <>
        <CommentCard
          comment={commentNode[0].value}
          path={commentNode[0].path}
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
          <CommentCard comment={commentBlob.value} path={commentBlob.path} />
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
