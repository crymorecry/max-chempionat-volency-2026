import { useTranslations } from "next-intl";
import { Text } from "@/shared/ui/components/text";
import NewsPage from "@/components/news/NewsPage";

export default function News() {
    const t = useTranslations('news');
    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex flex-col">
                <Text size="2xl" variant="primary">{t('title')}</Text>
                <Text size="sm" variant="secondary">{t('description')}</Text>
            </div>
            <NewsPage />
        </div>
    )
}