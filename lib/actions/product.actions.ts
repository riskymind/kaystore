"use server"
import {prisma} from "@/db/prisma"
import { convertToPlainObject } from "../utils"

export async function getLatestProudcts() {
    const data = await prisma.product.findMany({
        take: 4,
        orderBy: {createdAt: "desc"}
    })

    return convertToPlainObject(data)
}