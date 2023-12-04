import CommentsSection from "../../components/CommentsSection";
import CommentInput from "../../components/CommentInput";
import "../.././styles.css";

interface Props {
  params: { commentsId: string[] };
}

const page = ({ params: { commentsId } }: Props) => {
  return (
    <main>
      <CommentsSection commentsId={commentsId} />
      {!commentsId && <CommentInput />}
    </main>
  );
};

export default page;
