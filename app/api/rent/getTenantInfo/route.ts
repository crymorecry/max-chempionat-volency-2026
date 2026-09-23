import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const { userId, addressId } = await request.json();
    if (!userId || !addressId) {
        return NextResponse.json({ error: "User ID and address ID are required" }, { status: 400 });
    }
    const tenantInfo = await prisma.lease.findFirst({
        where: {
            tenantId: userId,
            apartmentId: addressId,
            isActive: true,
        },
        orderBy: {
            id: 'desc',
        },
    });
    return NextResponse.json(tenantInfo);
}