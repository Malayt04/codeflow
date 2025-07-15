import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { inngest } from "../../../inngest/client";
import { PrismaClient } from "@/generated/prisma";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";

const prisma = new PrismaClient();

export const messagesRouter = createTRPCRouter({
  getMany: protectedProcedure
  .input(
      z.object({
        projectId: z.string().min(1, {message:"Project ID is required"}),
      })
    )
    .query(async ({input, ctx}) => {
    const messages = await prisma.message.findMany({
      where: {
        projectId: input.projectId,
        project: {
          userId: ctx.auth.userId
        }
      },
      include:{
        fragments: true
      },
      orderBy: {
        updatedAt: "asc",
      },
    });

    if (!messages || messages.length === 0) {
      throw new TRPCError({code:"NOT_FOUND", message:"Messages not found"})
    }

    return messages;
  }),
  create: protectedProcedure
    .input(
      z.object({
        value: z.string(),
        projectId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.projectId,
          userId: ctx.auth.userId
        },
      })

      if (!existingProject) {
        throw new TRPCError({code:"NOT_FOUND", message:"Project not found"})
      }

      try {
        await consumeCredits()
      } catch (error) {
        if(error instanceof Error){
          throw new TRPCError({code:"BAD_REQUEST", message:"other error"})
        }else{
          throw new TRPCError({code:"TOO_MANY_REQUESTS", message:"You have run out of credits"})
        }


      }
      
      const newMessage = await prisma.message.create({
        data: {
          content: input.value,
          role: "USER",
          type: "RESULT",
          projectId: input.projectId
        },
      });

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: input.projectId
        },
      });

      return newMessage;
    }),
});
