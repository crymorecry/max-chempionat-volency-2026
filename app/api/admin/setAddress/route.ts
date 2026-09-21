import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ApartmentRole } from "@prisma/client"

export async function POST(request: Request) {
    const { maxUserId, address } = await request.json()
    if(!maxUserId || !address) {
        return NextResponse.json({ success: false, message: 'Max user ID and address are required' }, { status: 400 })
    }
    const getAddress = await prisma.apartment.findFirst({
        where: { address: address }
    })
    if(getAddress) {
        return NextResponse.json({ success: false, message: 'Address already exists' }, { status: 400 })
    }
    const addAddress = await prisma.apartment.create({
        data: { address: address }
    })
    const getUser = await prisma.user.findUnique({
        where: { maxUserId: maxUserId }
    })
    if(!getUser) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 400 })
    }
    const addUser = await prisma.userApartment.create({
        data: { userId: getUser.id, apartmentId: addAddress.id, role: ApartmentRole.OWNER }
    })
    return NextResponse.json({ success: true, apartmentId: addAddress.id, userId: addUser.id })
}