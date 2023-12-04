import SkeletonComponent from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Skeleton = ({
  width,
  height,
}: {
  width?: string | number;
  height?: string | number;
}) => {
  return <SkeletonComponent width={width} height={height} />;
};

export default Skeleton;
