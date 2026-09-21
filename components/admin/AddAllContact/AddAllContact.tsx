'use client'

import { Button } from "@maxhub/max-ui"

export default function AddAllContact() {
    const addContact = async () => {
        const response = await fetch('/api/admin/addAllContact', {
            method: 'POST',
        })
        const data = await response.json()
        console.log(data)
    }
    return (
        <div className="flex w-full justify-between items-center">
            <h1>Add All Contact</h1>
            <Button size="small" onClick={addContact}>Add All Contact</Button>
        </div>
    )
}