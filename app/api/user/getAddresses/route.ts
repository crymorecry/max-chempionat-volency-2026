import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const { userId } = await request.json();
    const addresses = await prisma.userApartment.findMany({
        where: { userId: userId },
        include: {
            apartment: true,
        },
    });
    return NextResponse.json(addresses.map((address) => ({ id: address.apartmentId, address: address.apartment.address, type: address.role })));
}