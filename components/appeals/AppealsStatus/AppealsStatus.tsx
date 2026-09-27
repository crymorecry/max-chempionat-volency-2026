import { Select } from "@/shared/ui/components/select";
import { useTranslations } from "next-intl";

export default function AppealsStatus({ status, setStatus }: { status: string, setStatus: (status: string) => void }) {
    const t = useTranslations('appeals.status');

    const statuses = [
        { label: t('all'), value: '' },
        { label: t('new'), value: 'CREATED' },
        { label: t('processing'), value: 'IN_PROGRESS' },
        { label: t('completed'), value: 'RESOLVED' }
    ] as const;

    return (
        <Select
            options={statuses as any}
            value={status}
            onChange={(value) => setStatus(value as any)}
            className="w-full dark:bg-volen-800 rounded-xl"
        />
    )
}