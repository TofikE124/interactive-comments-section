"use client";
import moment from "moment";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect } from "react";
import deleteIcon from "../../public/images/icons/icon-delete.svg";
import editIcon from "../../public/images/icons/icon-edit.svg";
import replyIcon from "../../public/images/icons/icon-reply.svg";

import { CommentWithPublisher } from "../api/comments/route";
import CommentInput from "./CommentInput";
import DeleteComment from "./DeleteComment";
import UpDownVote from "./UpDownVote";

const CommentCard = ({
  comment,
  path,
  parentPath,
}: {
  comment: CommentWithPublisher;
  path?: string;
  parentPath?: string;
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
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = comment.publisher;

  function calculateVotes(): number {
    let count = 0;
    comment.votes.forEach((vote) =>
      vote.type === "UPVOTE" ? count++ : count--
    );
    return count;
  }

  const isMine = user?.email === session?.user?.email;
  const isEditting = searchParams.get("edit") === comment.id.toString();
  const isReplying = searchParams.get("reply") === comment.id.toString();
  const isDeleting = searchParams.get("delete") === comment.id.toString();

  const CommentHeader = (
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
        {isMine && <div className="comment-card__header__user__you">You</div>}
      </div>
      <p className="comment-card__header__date">
        {moment(comment.createdAt).fromNow()}
      </p>
    </div>
  );

  const CommentActions =
    isEditting || isReplying ? (
      ""
    ) : isMine ? (
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
    );

  const CommentVotes = (
    <div className="comment-card__vote">
      <UpDownVote
        handleUpClick={handleUpVote}
        handleDownClick={handleDownVote}
        count={calculateVotes()}
      />
    </div>
  );

  const CommentContent =
    searchParams.get("edit") === comment.id.toString() ? (
      <div className="comment-card__content">
        <CommentInput
          editId={comment.id.toString()}
          textValue={comment.content}
        />
      </div>
    ) : (
      <p className="comment-card__content">{comment.content}</p>
    );

  return (
    <>
      <div className="comment-card-container">
        <div onClick={(e: any) => handleDivClick(e)} className="comment-card">
          {CommentHeader}
          {CommentContent}
          {CommentVotes}
          {CommentActions}
        </div>
        <div>
          {searchParams.get("replyId") === comment.id.toString() && (
            <CommentInput parentId={comment.id.toString()} />
          )}
        </div>
      </div>
      <DeleteComment commentId={comment.id.toString()} />
    </>
  );

  function handleDivClick(e: MouseEvent) {
    const target = e.target as HTMLElement;

    const textContainerClass = "textarea-container";
    const deleteClass = "comment-card__cta__delete";
    const replyClass = "comment-card__cta__reply";
    const editClass = "comment-card__cta__edit";
    const updownVoteClass = "updown-vote";

    // Textarea or updown vote
    if (
      target.parentElement?.className === textContainerClass ||
      target?.parentElement?.className === updownVoteClass ||
      target.className === updownVoteClass
    )
      return;
    // Delete
    else if (
      target.className === deleteClass ||
      target.parentElement?.className === deleteClass
    ) {
      // Save scroll in LocalStorage
      localStorage.setItem("persistentScroll", window.scrollY.toString());
      const params = new URLSearchParams(searchParams);
      router.push(`?delete=${comment.id.toString()}`);
    } else if (
      target.className === replyClass ||
      target.parentElement?.className === replyClass
    ) {
      // Reply?
      session?.user
        ? router.push(`/comments/${path}?replyId=${comment.id.toString()}`)
        : signIn("google");
    }
    // Edit
    else if (
      target.className === editClass ||
      target.parentElement?.className === editClass
    ) {
      router.push(`/comments/${path}?edit=${comment.id}`);
    } else {
      router.push(`/comments/${path}`);
    }
  }

  function handleUpVote() {
    
  }

  function handleDownVote() {}
};

export default CommentCard;
