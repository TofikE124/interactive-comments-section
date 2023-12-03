const UpDownVote = ({ count }: { count: number }) => {
  return <div className="updown-vote">
    <button>+</button>
    <p>{count}</p>
    <button>-</button>
  </div>;
};

export default UpDownVote;
 