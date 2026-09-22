"use client";
import { Input } from "@maxhub/max-ui";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NewsCatalogSearch({ search, setSearch }: { search: string, setSearch: (search: string) => void }) {
    const t = useTranslations('news');
    return (
        <div className="relative flex min-w-0  h-10">
            <SearchIcon className="w-5 h-5 opacity-50 z-0 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="w-full pl-12 pr-4 rounded-xl border-2 border-card-border text-base transition-all focus:outline-none focus:ring-2 ring-primary focus:ring-primary dark:bg-volen-800"
                style={{ color: 'var(--color-input-text)' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div >
    )
}