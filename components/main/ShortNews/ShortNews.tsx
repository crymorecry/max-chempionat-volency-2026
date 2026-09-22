'use client';
import { useTranslations } from "next-intl";
import { Text } from "@/shared/ui/components/text";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import React from "react";
import NewsCatalogCard from "@/components/news/NewsCatalogCard/NewsCatalogCard";
import { useToast } from "@/shared/ui/components/toast";

export default function ShortNews() {
    const t = useTranslations("main.news");
    const [news, setNews] = useState([]);
    const { showToast } = useToast();
    const n = useTranslations('news');
    const getNews = async () => {
        try {
            const response = await fetch("/api/house/getNews?limit=2&page=1", {
                method: "POST",
                body: JSON.stringify({
                    apartmentId: (JSON.parse(localStorage.getItem("address") || "{}"))?.id,
                })
            });
            const data = await response.json();
            if (response.ok) {
                setNews(data.news);
            } else {
                showToast(n('error'), 'error');
            }
        } catch (error) {
            showToast(n('error'), 'error');
        }
    }
    useEffect(() => {
        getNews();
    }, []);
    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex justify-between items-center">
                <Text size="2xl" variant="primary">{t('title')}</Text>
                <Link href="/news">
                    <Text size="sm" variant="secondary" className="flex items-center text-blue-500">
                        {t('viewAll')}
                        <ChevronRightIcon className="w-4 h-4" />
                    </Text>
                </Link>
            </div>
            <div className="flex flex-col gap-y-2">
                {news.map((item: any, index) => (
                    <React.Fragment key={index}>
                        <NewsCatalogCard news={item} />
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}