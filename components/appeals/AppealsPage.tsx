"use client";
import { useEffect, useState } from "react";
import AppealsSearch from "./AppealsSearch/AppealsSearch";
import { useTranslations } from "next-intl";
import AppealsEmpty from "./AppealsEmpty/AppealsEmpty";
import React from "react";
import { useToast } from "@/shared/ui/components/toast";
import AppealsLoading from "./AppealsLoading/AppealsLoading";
import AppealsStatus from "./AppealsStatus/AppealsStatus";
import AppealsCreate from "./AppealsCreate/AppealsCreate";
import AppealsCard from "./AppealsCard/AppealsCard";

export default function AppealsPage() {
    const t = useTranslations('appeals');

    const [appeals, setAppeals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const { showToast } = useToast();
    
    const getAppeals = async () => {
        try {
            const params = new URLSearchParams({
                search: search,
                status: status
            });
            const response = await fetch(`/api/appeals/getAppeals?${params.toString()}`, {
                method: 'POST',
                body: JSON.stringify({ 
                    userId: localStorage.getItem('userId'), 
                    apartmentId: JSON.parse(localStorage.getItem('address') || '{}')?.id 
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setAppeals(data.appeals);
            } else {
                showToast(t('error'), 'error');
            }
        } catch (error) {
            showToast(t('error'), 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAppeals();
    }, [search, status]);

    return (
        <div className="flex flex-col gap-y-2">
            <AppealsSearch search={search} setSearch={setSearch} />
            <AppealsStatus status={status} setStatus={setStatus} />

            <div className="flex flex-col gap-y-2">
                {!loading && appeals.length > 0 && appeals.map((item) => (
                    <React.Fragment key={item.id}>
                        <AppealsCard appeal={item} />
                    </React.Fragment>
                ))}
                {loading && (<AppealsLoading />)}
                {appeals.length === 0 && !loading && <AppealsEmpty getAppeals={getAppeals}/>}
            </div>
            <AppealsCreate size="small" getAppeals={getAppeals} />
        </div>
    )
}