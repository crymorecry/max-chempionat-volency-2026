import { useTranslations } from "next-intl";
import SadMonitorIcon from "@/components/helpers/sadMonitor";
import { Text } from "@/shared/ui/components/text";

export default function ContactEmpty() {
    const t = useTranslations('contact');
    return (
        <div className="flex flex-col gap-y-2 pt-20 items-center justify-center">
            <SadMonitorIcon className="w-20 h-20 text-destructive" />
            <div className="flex flex-col gap-y-2 items-center text-center">
                <Text size="xl" variant="primary">{t('noContactsFound')}</Text>
            </div>
        </div>
    )
}