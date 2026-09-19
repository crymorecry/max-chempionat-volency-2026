'use client'
export default function AdminPage() {
    const getData = async () => { 
        const response = await fetch('/api/admin/getStatusBot')
        const data = await response.json()
        console.log(data)
        return data
    }
    return (
        <div>
            <h1>Admin</h1>
            <button onClick={getData}>Get Data</button>
        </div>
    )
}