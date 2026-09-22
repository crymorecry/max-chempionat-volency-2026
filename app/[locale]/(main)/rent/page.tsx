import RentPage from "@/components/rent/RentPage";
import { Text } from "@/shared/ui/components/text";
import { useTranslations } from "next-intl";

export default function Rent() {
    const t = useTranslations("rent");
    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex flex-col">
                <Text size="2xl" variant="primary">{t('title')}</Text>
                <Text size="sm" variant="secondary">{t('description')}</Text>
            </div>
            <RentPage />
        </div>
    )
}