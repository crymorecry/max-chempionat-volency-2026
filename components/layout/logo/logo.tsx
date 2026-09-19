import Image from "next/image";
import { Text } from "@/shared/ui/components/text";
export default function Logo() {
    return (
        <div className="flex gap-x-1 items-end">
            <Image src="/logo.svg" alt="Logo" width={100} height={100} className="w-7 h-7" />
            <Text size="2xl" variant="primary">Домовик</Text>
        </div>
    );
}