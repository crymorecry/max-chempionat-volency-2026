import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const { ownerId, apartmentId } = await request.json();
    if (!ownerId || !apartmentId) {
        return NextResponse.json({ error: "Owner ID and apartment ID are required" }, { status: 400 });
    }
    const fetchLeases = await prisma.lease.findMany({
        where: {
            ownerId: ownerId,
            apartmentId: apartmentId,
        },
    });
    const leases = fetchLeases.reverse();
    if (((leases[0]?.endsAt && leases[0]?.endsAt < new Date()) || !leases[0]?.endsAt) && leases.length > 0) {
        return NextResponse.json({
            now: leases[0] || null,
            past: leases.slice(1),
        });
    }
    return NextResponse.json({
        now: null,
        past: leases,
    });
}