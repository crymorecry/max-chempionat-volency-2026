"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Text } from "@/shared/ui/components/text";
import { BanknoteIcon, CalendarIcon, ScrollTextIcon } from "lucide-react";

export default function TenantInfo() {
    const t = useTranslations("tenant");
    const [loading, setLoading] = useState(false);
    const [tenantInfo, setTenantInfo] = useState<any>(null);

    const getInfo = async () => {
        try {
            const response = await fetch("/api/rent/getTenantInfo", {
                method: "POST",
                body: JSON.stringify({
                    userId: localStorage.getItem("userId"),
                    addressId: JSON.parse(localStorage.getItem("address") || "{}").id,
                }),
            });
            const data = await response.json();
            setTenantInfo(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(JSON.parse(localStorage.getItem("address") || "{}")) {
            getInfo();
        }
    }, []);

    return tenantInfo && (
        <div className="flex flex-col gap-y-2">
            <h2 className="text-2xl font-bold">{t("titleMain")}</h2>
            <div className="flex flex-col gap-y-2 px-4 py-2  border border-card-border rounded-lg">
                <Text size="xs" variant="secondary">{t("price")}</Text>
                <Text size="xl" variant="primary">{tenantInfo?.price} ₽ / {t('month')}</Text>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-y-2 px-4 py-2  border border-card-border rounded-lg">
                    <Text size="xs" variant="secondary">{t("payment")}</Text>
                    <Text size="xl" variant="primary">{tenantInfo?.paymentDay}</Text>
                </div>
                <div className="flex flex-col gap-y-2 px-4 py-2  border border-card-border rounded-lg">
                    <Text size="xs" variant="secondary">{t("counter")}</Text>
                    <Text size="xl" variant="primary">{tenantInfo?.meterReadingDay}</Text>
                </div>
            </div>
        </div >
    )
}