"use client";
import React, { useEffect } from "react";

const ScrollToBottom = () => {
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  return <></>;
};

export default ScrollToBottom;
