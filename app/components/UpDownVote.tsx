"use client";

import { VoteType } from "@prisma/client";
import Spinner from "./Spinner";

const UpDownVote = ({
  count,
  handleUpClick = () => {},
  handleDownClick = () => {},
  defaultValue = null,
  isVoting = false,
}: {
  count: number;
  handleUpClick?: () => void;
  handleDownClick?: () => void;
  defaultValue?: VoteType | null;
  isVoting?: boolean;
}) => {
  return (
    <div className="updown-vote">
      {isVoting ? (
        <Spinner />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default UpDownVote;
