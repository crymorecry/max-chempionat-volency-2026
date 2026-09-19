import Image from "next/image";
import { Text } from "@/shared/ui/components/text";

export default function Logo({ size = "default"}: { size?: "default" | "xl" }) {
    const sizeClass = size === "xl" ? "w-10 h-10" : "w-7 h-7" as const;
    return (
        <div className="flex gap-x-1 items-end">
            <Image src="/logo.svg" alt="Logo" width={100} height={100} className={sizeClass} />
            <Text size={size === "xl" ? "3xl" : "2xl"} variant="primary">Домовик</Text>
        </div>
    );
}