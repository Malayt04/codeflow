import {RateLimiterPrisma} from "rate-limiter-flexible"
import { PrismaClient } from "@/generated/prisma"
import { auth } from "@clerk/nextjs/server"

const prisma = new PrismaClient()

const GENERATION_COST = 1;
const FREE_POINTS = 5
const DURATION = 30*24*60*60

export async function getUsageTracker(){
    const usageTracker = new RateLimiterPrisma({
        storeClient: prisma,
        tableName: "Usage",
        points: FREE_POINTS,
        duration: DURATION
    })

    return usageTracker
}

export async function consumeCredits(){
    const {userId} = await auth()
    if(!userId){
        throw new Error("User not authenticated")        
    }

    const usageTracker = getUsageTracker()
    const result = (await usageTracker).consume(userId, GENERATION_COST)

    return result
}

export async function getUsageStatus(){
    const {userId} = await auth()
    if(!userId){
        throw new Error("User not authenticated")        
    }

    const usageTracker = await getUsageTracker()
    const result = await usageTracker.get(userId)

    return result
}

''