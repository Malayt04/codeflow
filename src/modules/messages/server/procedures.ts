import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { inngest } from "../../../inngest/client";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const messagesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const messages = await prisma.message.findMany({
      orderBy: {
        updatedAt: "asc",
      },
    });
    return messages;
  }),
  create: baseProcedure
    .input(
      z.object({
        value: z.string(),
        projectId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
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
