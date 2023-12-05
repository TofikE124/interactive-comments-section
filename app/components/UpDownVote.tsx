"use client";

import { VoteType } from "@prisma/client";

const UpDownVote = ({
  count,
  handleUpClick = () => {},
  handleDownClick = () => {},
  defaultValue = null,
}: {
  count: number;
  handleUpClick?: () => void;
  handleDownClick?: () => void;
  defaultValue?: VoteType | null;
}) => {
  return (
    <div className="updown-vote">
      <button
        className={defaultValue === "UPVOTE" ? "vote-marked" : ""}
        onClick={() => handleUpClick()}
      >
        +
      </button>
      <p>{count}</p>
      <button
        className={defaultValue === "DOWNVOTE" ? "vote-marked" : ""}
        onClick={() => handleDownClick()}
      >
        -
      </button>
    </div>
  );
};

export default UpDownVote;
