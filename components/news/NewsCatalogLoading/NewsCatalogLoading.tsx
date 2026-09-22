import Skeleton from "@/shared/ui/components/Skeleton";

export default function NewsCatalogLoading() {
    return (
        <div className="flex flex-col gap-y-4">
            <Skeleton className="w-full h-36"
                count={5}
            />
        </div>
    )
}