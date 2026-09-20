import { cn } from "../utils/cn";

export default function Skeleton({ className, count }: { className?: string, count?: number }) {
    return (
        <>
            {Array.from({ length: count || 1 }).map((_, index) => (
                <div key={index} className={cn("animate-pulse bg-volen-100 dark:bg-volen-800 flex h-full w-full rounded-xl", className)}>
                </div>
            ))}
        </>
    )
}