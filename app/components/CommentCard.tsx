"use client";
import moment from "moment";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, MouseEventHandler, useEffect, useState } from "react";
import replyIcon from "../../public/images/icons/icon-reply.svg";
import { CommentWithPublisher } from "../api/comments/route";
import CommentInput from "./CommentInput";
import UpDownVote from "./UpDownVote";
import { User } from "@prisma/client";

const CommentCard = ({
  comment,
  path,
}: {
  comment: CommentWithPublisher;
  path?: string;
}) => {
  const params: { commentsId: string[] } = useParams();
  const searchParams = useSearchParams();
  // Keep Scroll in place when params change
  useEffect(() => {
    const persistentScroll = localStorage.getItem("persistentScroll");
    if (persistentScroll === null) return;

    window.scrollTo({ top: Number(persistentScroll) });

    if (Number(persistentScroll) === window.scrollY)
      localStorage.removeItem("persistentScroll");
  }, [params]);

  const router = useRouter();
  const { data: session } = useSession();
  const user = comment.publisher;

  function handleClick(e: MouseEvent) {
    localStorage.setItem("persistentScroll", window.scrollY.toString());
    const target = e.target as HTMLElement;
    target.className === "comment-card__reply" ||
    target.parentElement?.className === "comment-card__reply"
      ? router.push(`/comments/${path}?reply=${comment.id}`)
      : comment.id.toString() && router.push(`/comments/${path}`);
  }

  return (
    <div className="comment-card-container">
      <div onClick={(e: any) => handleClick(e)} className="comment-card">
        <div className="comment-card__header">
          <Image
            className="comment-card__header__avatar"
            src={user?.image || "https://i.stack.imgur.com/34AD2.jpg"}
            height={32}
            width={32}
            alt="avatar"
          />
          <div className="comment-card__header__user">
            <h2>{user?.name}</h2>
            {user?.email === session?.user?.email && (
              <div className="comment-card__header__user__you">You</div>
            )}
          </div>
          <p className="comment-card__header__date">
            {moment(comment.createdAt).fromNow()}
          </p>
        </div>

        <p className="comment-card__content">{comment.content}</p>
        <div className="comment-card__vote">
          <UpDownVote count={10} />
        </div>
        <button className="comment-card__reply">
          <Image src={replyIcon} alt="reply icon" />
          <p>Reply</p>
        </button>
      </div>
      <div>
        {searchParams.get("reply") === comment.id.toString() && (
          <CommentInput parentId={comment.id.toString()} />
        )}
      </div>
    </div>
  );
};

export default CommentCard;
