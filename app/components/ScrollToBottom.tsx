"use client";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { CommentWithPublisherAndReplies } from "../api/comments/route";

const ScrollToBottom = ({
  comments,
}: {
  comments?: CommentWithPublisherAndReplies[];
}) => {
  const { commentsId } = useParams();
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [commentsId, comments?.length]);
  return <></>;
};

export default ScrollToBottom;
