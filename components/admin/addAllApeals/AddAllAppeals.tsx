'use client'

import { Button } from "@/shared/ui/components/button";
export default function AddAllAppeals() {
    const addAppeals = async () => {
        const response = await fetch('/api/admin/addAllAppeals', {
            method: 'POST',
        })
        const data = await response.json()
        console.log(data)
    }
    return (
        <div className="flex w-full justify-between items-center">
            <h1>Add All Appeals</h1>
            <Button size="default" variant="primary" onClick={addAppeals}>Add All Appeals</Button>
        </div>
    )
}