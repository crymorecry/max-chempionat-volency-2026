import { useTranslations } from "next-intl";
import { Text } from "@/shared/ui/components/text";
import NewsPage from "@/components/news/NewsPage";

export default function News() {
    const t = useTranslations('news');
    return (
        <div className="flex flex-col gap-y-2">
            <Text size="2xl" variant="primary">{t('title')}</Text>
            <NewsPage />
        </div>
    )
}