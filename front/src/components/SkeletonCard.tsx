import { Skeleton } from "@/components/ui/skeleton"

const SkeletonCard = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-full w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  )
}

export default SkeletonCard
