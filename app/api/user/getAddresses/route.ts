import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const addresses = [
        { address: '123 Main St, Anytown, USA', type: "owner" },
        { address: '456 Oak Ave, Othertown, USA', type: "tenant" },
        { address: '789 Pine Rd, Anothertown, USA', type: "tenant" },
    ]

    return NextResponse.json(addresses);
}