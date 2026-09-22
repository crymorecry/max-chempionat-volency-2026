'use client'
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ContactCard from "./ContactCard/ContactCard";
import React from "react";
import { useToast } from "@/shared/ui/components/toast";
import ContactLoading from "./ContactLoading/ContactLoading";
import ContactEmpty from "./ContactEmpty/ContactEmpty";

export default function ContactPage() {
    const t = useTranslations("contact");
    const [contacts, setContacts] = useState([]);
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const getContacts = async () => {
        try {
            const response = await fetch('/api/house/getContacts', {
                method: 'POST',
                body: JSON.stringify({ apartmentId: JSON.parse(localStorage.getItem('address') || '{}').id }),
            });
            const data = await response.json();
            setContacts(data);
        } catch (error) {
            showToast(t('error'), 'error');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getContacts();
    }, []);
    return (
        <div className="flex flex-col gap-y-2">
            {!loading && contacts.length > 0 && contacts.map((contact: any) => (
                <React.Fragment key={contact.id}>
                    <ContactCard contact={contact} />
                </React.Fragment>
            ))}
            {loading && <ContactLoading />}
            {!loading && contacts.length === 0 && <ContactEmpty />}
        </div>
    )
}   