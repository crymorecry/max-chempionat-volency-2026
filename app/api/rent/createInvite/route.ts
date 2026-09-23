import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const { ownerId, apartmentId, price, paymentDate, counterDate, conditionsRent } = await request.json();
    if (!ownerId || !apartmentId || !price || !paymentDate || !counterDate) {
        return NextResponse.json({ error: "All fields must be filled" }, { status: 400 });
    }
    const allRents = await prisma.lease.findFirst({
        where: {
            apartmentId: apartmentId,
            ownerId: ownerId,
            isActive: true,
        },
        orderBy: {
            id: 'desc',
        },
    });
    if (allRents) {
        return NextResponse.json({ error: "Rent already exists" }, { status: 400 });
    }
    const createInvite = await prisma.lease.create({
        data: {
            ownerId: ownerId,
            apartmentId: apartmentId,
            price: price,
            paymentDay: paymentDate,
            meterReadingDay: counterDate,
            conditionsRent: conditionsRent,
        }
    });
    const updateUrl = await prisma.lease.update({
        where: { id: createInvite.id },
        data: { maxInviteUrl: `${process.env.MAX_BOT_URL}?startapp=${createInvite.id}` }
    });
    return NextResponse.json({ url: updateUrl.maxInviteUrl });
}