import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const { ownerId, apartmentId } = await request.json();
    if (!ownerId || !apartmentId) {
        return NextResponse.json({ error: "Owner ID and apartment ID are required" }, { status: 400 });
    }
    const nowLease = await prisma.lease.findFirst({
        where: {
            ownerId: ownerId,
            apartmentId: apartmentId,
            isActive: true,
        },
        include: {
            tenant: true,
        },
        orderBy: {
            id: 'desc',
        },
    });
    const pastLeases = await prisma.lease.findMany({
        where: {
            ownerId: ownerId,
            apartmentId: apartmentId,
            isActive: false,
        },
    });
    return NextResponse.json({
        now: nowLease,
        past: pastLeases,
    });
}