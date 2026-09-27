import prisma from "@/lib/prisma";
import { RequestStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim().toLowerCase() || '';
    const status = searchParams.get('status') as RequestStatus | undefined;

    const { userId, apartmentId } = await request.json();

    const appeals = await prisma.request.findMany({
        where: {
            title: { contains: search as string },
            userId: userId,
            apartmentId: apartmentId,
            ...(status && {
                status: status as RequestStatus,
            }),
        },
        orderBy: {
            id: 'desc'
        },
        include: {
            statusHistory: {
                take: 1,
                orderBy: {
                    id: 'desc'
                }
            },
        }
    })
    const result = appeals.map(({ statusHistory, ...appeal }) => ({
        ...appeal,
        statusHistory: statusHistory[0] ?? null,
    }));
    return NextResponse.json({ appeals: result });
}