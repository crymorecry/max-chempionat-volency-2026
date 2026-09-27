import { RequestStatus } from "@prisma/client";
import { useTranslations } from "next-intl";
import { Text } from "@/shared/ui/components/text";

export default function AppealsStatus({ size = 'xs', status }: { size?: 'xs' | 'base', status: RequestStatus }) {
    const t = useTranslations('appeals.card.status');
    const statuses = [
        { value: RequestStatus.CREATED, color: 'blue-500' },
        { value: RequestStatus.IN_PROGRESS, color: 'yellow-500' },
        { value: RequestStatus.RESOLVED, color: 'green-500' },
    ]
    return (
        <div className={`flex items-center gap-x-2 bg-${statuses.find(s => s.value === status)?.color}/20 rounded-full px-2 py-1`}>
            <Text size={size} className={`text-${statuses.find(s => s.value === status)?.color}`}>{t(status)}</Text>
        </div>
    )
}