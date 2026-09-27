import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { title, description, topic, userId, apartmentId } = await req.json();

    if (!title || !description || !topic || !userId || !apartmentId) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    
    const request = await prisma.request.create({
        data: {
            title,
            description,
            topic,
            userId,
            apartmentId
        }
    });
    return NextResponse.json({ message: 'Request created', request }, { status: 200 });
}