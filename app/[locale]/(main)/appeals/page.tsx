import { useTranslations } from "next-intl";
import { Text } from "@/shared/ui/components/text";
import AppealsPage from "@/components/appeals/AppealsPage";

export default function Appeals() {
    const t = useTranslations("appeals");
    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex flex-col">
                <Text size="2xl" variant="primary">{t('title')}</Text>
                <Text size="sm" variant="secondary">{t('description')}</Text>
            </div>
            <AppealsPage />
        </div>
    )
}