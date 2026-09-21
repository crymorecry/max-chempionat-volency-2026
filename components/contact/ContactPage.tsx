'use client'
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ContactCard from "./ContactCard/ContactCard";
import React from "react";

export default function ContactPage() {
    const t = useTranslations("contact");
    const [contacts, setContacts] = useState([]);

    const getContacts = async () => {
        const response = await fetch('/api/house/getContacts', {
            method: 'POST',
            body: JSON.stringify({ apartmentId: JSON.parse(localStorage.getItem('address') || '{}').id }),
        });
        const data = await response.json();
        setContacts(data);
    }

    useEffect(() => {
        getContacts();
    }, []);
    return (
        <div className="flex flex-col gap-y-2">
            {contacts.map((contact: any) => (
                <React.Fragment key={contact.id}>
                    <ContactCard contact={contact} />
                </React.Fragment>
            ))}
        </div>
    )
}   