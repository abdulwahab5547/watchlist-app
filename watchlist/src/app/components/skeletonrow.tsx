import SkeletonPortrait from "./skeletonportrait";

function SkeletonRow() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-8 gap-4">
      <SkeletonPortrait />
      <SkeletonPortrait />
      <SkeletonPortrait />
      <SkeletonPortrait />
      <SkeletonPortrait />
      <SkeletonPortrait />
      <SkeletonPortrait />
      <SkeletonPortrait />
    </div>
  );
}

export default SkeletonRow;