import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const { userId, leaseId } = await request.json();
    const lease = await prisma.lease.findUnique({
        where: { id: leaseId },
    });
    if (!lease) {
        return NextResponse.json({ error: 'Lease not found' }, { status: 404 });
    }
    if (lease.tenantId) {
        return NextResponse.json({ error: 'Lease already accepted' }, { status: 400 });
    }
    const address = await prisma.lease.update({
        where: { id: leaseId },
        data: { tenantId: userId },
        include: {
            apartment: true,
        },
    });
    return NextResponse.json({ id: address.apartment.id, address: address.apartment.address, type: "TENANT" }, { status: 200 });
}