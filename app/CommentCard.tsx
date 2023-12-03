import Image from "next/image";
import UpDownVote from "./UpDownVote";
import replyIcon from "../public/images/icons/icon-reply.svg";

const CommentContainer = ({}) => {
  return (
    <div className="comment-card">
      <div className="comment-card__header">
        <Image
          className="comment-card__header__avatar"
          src=""
          height={32}
          width={32}
          alt="avatar"
        />
        <h2 className="comment-card__header__user">amyrobson</h2>
        <p className="comment-card__header__date">1 month ago</p>
      </div>

      <p className="comment-card__content">
        Impressive! Though it seems the drag feature could be improved. But
        overall it looks incredible. You’ve nailed the design and the
        responsiveness at various breakpoints works really well.
      </p>
      <div className="comment-card__vote">
        <UpDownVote count={10} />
      </div>
      <button className="comment-card__reply">
        <Image src={replyIcon} alt="reply icon" />
        <p>Reply</p>
      </button>
    </div>
  );
};

export default CommentContainer;
