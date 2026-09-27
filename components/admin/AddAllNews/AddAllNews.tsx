'use client'

import { Button } from "@/shared/ui/components/button";

export default function AddAllNews() {
    const addNews = async () => {
        const response = await fetch('/api/admin/addNews', {
            method: 'POST',
        })
        const data = await response.json()
        console.log(data)
    }
    return (
        <div className="flex w-full justify-between items-center">
            <h1>Add All News</h1>
            <Button size="default" variant="primary" onClick={addNews}>Add All News</Button>
        </div>
    )
}