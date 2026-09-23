import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApartmentRole } from "@prisma/client";

export async function POST(request: Request) {
    const { userId, leaseId, tenantId } = await request.json();
    const lease = await prisma.lease.findUnique({
        where: { id: leaseId, ownerId: userId, tenantId: tenantId },
    });
    if (!lease) {
        return NextResponse.json({ error: "Lease not found" }, { status: 404 });
    }
    await prisma.lease.update({
        where: { id: leaseId },
        data: { isActive: false },
    });

    await prisma.userApartment.deleteMany({
        where: { apartmentId: lease.apartmentId, userId: tenantId, role: ApartmentRole.TENANT },
    });
    return NextResponse.json({ message: "Lease ended successfully" }, { status: 200 });
}