'use client'
import { Button } from "@/shared/ui/components/button";

export default function GetStatusBot() {
    const getData = async () => {
        const response = await fetch('/api/admin/getStatusBot')
        const data = await response.json()
        console.log(data)
    }
    return (
        <div className="flex w-full justify-between items-center">
            <h1>Get Status Bot</h1>
            <Button size="default" variant="primary" onClick={getData}>Get Data</Button>
        </div>
    )
}