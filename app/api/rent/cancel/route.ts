import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const { leaseId } = await request.json();
    const lease = await prisma?.lease.findUnique({
        where: {
            id: leaseId,
        },
    });
    if (!lease) {
        return NextResponse.json({ error: 'Lease not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Lease cancelled' }, { status: 200 });
}