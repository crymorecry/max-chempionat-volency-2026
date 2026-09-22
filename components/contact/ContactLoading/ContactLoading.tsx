import Skeleton from "@/shared/ui/components/Skeleton";

export default function ContactLoading() {
    return (
        <div className="flex flex-col gap-y-4">
            <Skeleton className="w-full h-20"
                count={5}
            />
        </div>
    )
}