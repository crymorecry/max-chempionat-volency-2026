import { RequestStatus } from "@prisma/client";
import { useTranslations } from "next-intl";
import { Text } from "@/shared/ui/components/text";

export default function AppealsStatus({ size = "xs", status }: { size?: "xs" | "base"; status: RequestStatus }) {
    const t = useTranslations("appeals.card.status");

    const statuses = [
        { value: RequestStatus.CREATED, color: "#1161EF" },
        { value: RequestStatus.IN_PROGRESS, color: "#D97706" },
        { value: RequestStatus.RESOLVED, color: "#16A34A" },
    ];

    const currentStatus = statuses.find((s) => s.value === status);

    return (
        <div className={`flex items-center gap-x-2 px-2 py-1 w-fit ${size === "xs" ? "rounded-md" : "rounded-lg px-4"}`}
            style={{ backgroundColor: `${currentStatus?.color}30` }}>
            <Text style={{ color: currentStatus?.color }} size={size}>{t(status)}</Text>
        </div>
    );
}