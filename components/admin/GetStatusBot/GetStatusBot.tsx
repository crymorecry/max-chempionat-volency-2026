'use client'

import { useState } from "react"
import { Button } from "@maxhub/max-ui"

export default function GetStatusBot() {
    const getData = async () => {
        const response = await fetch('/api/admin/getStatusBot')
        const data = await response.json()
        console.log(data)
    }
    return (
        <div className="flex w-full justify-between items-center">
            <h1>Get Status Bot</h1>
            <Button size="small" onClick={getData}>Get Data</Button>
        </div>
    )
}