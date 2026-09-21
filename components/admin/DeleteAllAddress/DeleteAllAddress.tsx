'use client'

import { Button } from "@maxhub/max-ui"

export default function DeleteAllAddress() {
    const deleteAllAddress = async () => {
        const response = await fetch('/api/admin/DeleteAllAddress', {
            method: 'DELETE',
        })
        const data = await response.json()
        console.log(data)
    }
    return (
        <>
            <div className="flex w-full justify-between items-center">
                <h1>Delete All Address</h1>
                <Button size="small" onClick={deleteAllAddress}>Delete All Address</Button>
            </div>
        </>
    )
}