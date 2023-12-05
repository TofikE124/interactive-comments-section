"use client";
import moment from "moment";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, MouseEventHandler, useEffect, useState } from "react";
import replyIcon from "../../public/images/icons/icon-reply.svg";
import deleteIcon from "../../public/images/icons/icon-delete.svg";
import editIcon from "../../public/images/icons/icon-edit.svg";

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
    const target = e.target as HTMLElement;

    // Textarea
    if (target.parentElement?.className === "textarea-container") return;

    localStorage.setItem("persistentScroll", window.scrollY.toString());

    // Reply?
    if (
      target.className === "comment-card__cta__reply" ||
      target.parentElement?.className === "comment-card__cta__reply"
    ) {
      session?.user
        ? router.push(`/comments/${path}?replyId=${comment.id.toString()}`)
        : signIn("google");
    }

    // Edit
    if (
      target.className === "comment-card__cta__edit" ||
      target.parentElement?.className === "comment-card__cta__edit"
    ) {
      router.push(`/comments/${path}?edit=${comment.id}`);
    } else {
      router.push(`/comments/${path}`);
    }
  }

  const isMine = user?.email === session?.user?.email;

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
            {isMine && (
              <div className="comment-card__header__user__you">You</div>
            )}
          </div>
          <p className="comment-card__header__date">
            {moment(comment.createdAt).fromNow()}
          </p>
        </div>

        {searchParams.get("edit") === comment.id.toString() ? (
          <div className="comment-card__content">
            <CommentInput
              editId={comment.id.toString()}
              textValue={comment.content}
            />
          </div>
        ) : (
          <p className="comment-card__content">{comment.content}</p>
        )}

        <div className="comment-card__vote">
          <UpDownVote count={10} />
        </div>
        {isMine ? (
          <div className="comment-card__cta flex gap-6">
            <button className="comment-card__cta__delete">
              <Image src={deleteIcon} alt="reply icon" />
              <p>Delete</p>
            </button>
            <button className="comment-card__cta__edit">
              <Image src={editIcon} alt="reply icon" />
              <p>Edit</p>
            </button>
          </div>
        ) : (
          <div className="comment-card__cta">
            <button className="comment-card__cta__reply">
              <Image src={replyIcon} alt="reply icon" />
              <p>Reply</p>
            </button>
          </div>
        )}
      </div>
      <div>
        {searchParams.get("replyId") === comment.id.toString() && (
          <CommentInput parentId={comment.id.toString()} />
        )}
      </div>
    </div>
  );
};

export default CommentCard;
