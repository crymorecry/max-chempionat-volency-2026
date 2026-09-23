import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { apartmentId } = await request.json();
    const contacts = await prisma.contact.findMany({
        where: {
            apartmentId: apartmentId,
        },
        orderBy: {
            id: 'desc',
        },
    });
    return NextResponse.json(contacts);
}