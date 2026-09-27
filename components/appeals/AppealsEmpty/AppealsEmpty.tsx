import { useTranslations } from "next-intl";
import SadMonitorIcon from "@/components/helpers/sadMonitor";
import { Text } from "@/shared/ui/components/text";
import AppealsCreate from "../AppealsCreate/AppealsCreate";

export default function AppealsEmpty({ getAppeals }: { getAppeals: () => void }) {
    const t = useTranslations('appeals');
    return (
        <div className="flex flex-col gap-y-4 pt-20 items-center justify-center">
            <div className="flex flex-col gap-y-0 items-center text-center">
                <SadMonitorIcon className="w-20 h-20 text-destructive" />
                <div className="flex flex-col gap-y-0 items-center text-center">
                    <Text size="xl" variant="primary">{t('noAppealsFound')}</Text>
                    <Text size="base" variant="secondary">{t('noAppealsFoundDescription')}</Text>
                </div>
            </div>
            <AppealsCreate getAppeals={getAppeals} />
        </div>
    )
}