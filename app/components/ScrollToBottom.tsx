"use client";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const ScrollToBottom = () => {
  const searchParams = useSearchParams();
  const { commentsId } = useParams();
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [commentsId]);
  return <></>;
};

export default ScrollToBottom;
