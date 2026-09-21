import { Text } from "@/shared/ui/components/text";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function ContactCard({ contact }: { contact: any }) {
    const t = useTranslations("contact");
    return (
        <div className="flex flex-col gap-y-2 border border-card-border rounded-lg p-2">
            <div className="flex flex-col">
                <Text size="base" variant="primary">{contact.name}</Text>
                <Text size="sm" variant="secondary">{contact.description}</Text>
            </div>
            <Link href={`tel:${contact.phone}`} className="bg-primary hover:bg-primary/80 text-white px-3 py-1.5 rounded-lg text-center text-sm">{t('call')}</Link>
        </div>
    )
}   