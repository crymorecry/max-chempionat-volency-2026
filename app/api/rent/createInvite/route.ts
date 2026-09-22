import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const { ownerId, apartmentId, price, paymentDate, counterDate, endsDate, conditionsRent } = await request.json();
    if (!ownerId || !apartmentId || !price || !paymentDate || !counterDate) {
        return NextResponse.json({ error: "All fields must be filled" }, { status: 400 });
    }
    const allRents = await prisma.lease.findMany({
        where: {
            apartmentId: apartmentId,
            ownerId: ownerId,
        },
    });
    const leases = allRents.reverse();
    if (((leases[0]?.endsAt && leases[0]?.endsAt < new Date()) || !leases[0]?.endsAt) && leases.length > 0) {
        return NextResponse.json({ error: "Rent already exists" }, { status: 400 });
    }
    const createInvite = await prisma.lease.create({
        data: {
            ownerId: ownerId,
            apartmentId: apartmentId,
            price: price,
            paymentDay: paymentDate,
            meterReadingDay: counterDate,
            endsAt: endsDate,
            conditionsRent: conditionsRent,
        }
    });
    const updateUrl = await prisma.lease.update({
        where: { id: createInvite.id },
        data: { maxInviteUrl: `${process.env.MAX_BOT_URL}?startapp=${createInvite.id}` }
    });
    return NextResponse.json({ url: updateUrl.maxInviteUrl });
}