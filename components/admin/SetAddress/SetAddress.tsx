'use client'
import { Button, Input } from "@maxhub/max-ui"
import { Form } from "lucide-react"
import { useState } from "react"

export default function SetAddress() {
    const [address, setAddress] = useState('')
    const [maxUserId, setMaxUserId] = useState('')
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const response = await fetch('/api/admin/setAddress', {
            method: 'POST',
            body: JSON.stringify({ maxUserId, address })
        })
        const data = await response.json()
        console.log(data)
    }
    return (
        <div className="flex flex-col gap-2">
            <h1>Set Address to user(owner)</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input type="text" className="w-full border border-gray-300 rounded-md p-2" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                <input type="text" className="w-full border border-gray-300 rounded-md p-2" placeholder="Max User ID" value={maxUserId} onChange={(e) => setMaxUserId(e.target.value)} />
                <Button size="small" type="submit">Set Address</Button>
            </form>
        </div>
    )
}