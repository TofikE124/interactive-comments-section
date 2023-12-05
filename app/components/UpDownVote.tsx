"use client";
const UpDownVote = ({
  count,
  handleUpClick = () => {},
  handleDownClick = () => {},
}: {
  count: number;
  handleUpClick?: () => void;
  handleDownClick?: () => void;
}) => {
  return (
    <div className="updown-vote">
      <button onClick={() => handleUpClick()}>+</button>
      <p>{count}</p>
      <button onClick={() => handleDownClick}>-</button>
    </div>
  );
};

export default UpDownVote;
