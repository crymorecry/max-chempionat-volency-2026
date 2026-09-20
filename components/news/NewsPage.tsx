"use client";
import { useEffect, useState } from "react";
import NewsCatalogSearch from "./NewsCatalogSearch/NewsCatalogSearch";
import { useTranslations } from "next-intl";
import NewsCatalogEmpty from "./NewsCatalogEmpty/NewsCatalogEmpty";
import NewsCatalogLoading from "./NewsCatalogLoading/page";
import NewsCatalogCard from "./NewsCatalogCard/NewsCatalogCard";
import { Button } from "@maxhub/max-ui";
import React from "react";

const PAGE_SIZE = 5;

export default function NewsPage() {
    const [news, setNews] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const t = useTranslations('news');
    const [maxPage, setMaxPage] = useState(1);

    useEffect(() => {
        const getNews = async () => {
            if (page === 1) {
                setLoading(true);
            }
            try {
                const params = new URLSearchParams({
                    search: search,
                    page: String(page),
                    limit: String(PAGE_SIZE),
                });
                const response = await fetch(`/api/house/getNews?${params.toString()}`);
                const data = await response.json();

                setNews((prev) => (page === 1 ? data.news : [...prev, ...data.news]));
                setMaxPage(data.maxPage || 1);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getNews();
    }, [search, page]);

    return (
        <div className="flex flex-col gap-y-2">
            <NewsCatalogSearch search={search} setSearch={setSearch} />
            <div className="flex flex-col gap-y-2">
                {!loading && news.length > 0 && news.map((item) => (
                    <React.Fragment key={item.id}>
                        <NewsCatalogCard news={item} />
                    </React.Fragment>
                ))}
                {loading && (<NewsCatalogLoading />)}
                {news.length === 0 && !loading && <NewsCatalogEmpty />}
                {news.length > 0 && !loading && page < maxPage && (
                    <Button size="small" variant="secondary" onClick={() => setPage(page + 1)}>
                        {t('loadMore')}
                    </Button>
                )}
            </div>
        </div>
    )
}