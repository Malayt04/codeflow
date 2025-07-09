import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { inngest } from "../../../inngest/client";
import { PrismaClient } from "@/generated/prisma";
import {generateSlug} from "random-word-slugs";

const prisma = new PrismaClient();

export const projectsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const projects = await prisma.project.findMany({
      orderBy: {
        updatedAt: "asc",
      },
    });
    return projects;
  }),
  create: baseProcedure
    .input(
      z.object({
        value: z.string(),
      })
    )
    .mutation(async ({ input }) => {

        const createdProject = await prisma.project.create({
          data: {
            name: generateSlug(2, {
                format: "kebab",
            }),
            message: {
                create: {
                    content: input.value,
                    role: "USER",
                    type: "RESULT",
                }
            }
          },
        })

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: createdProject.id
        },
      });

      return createdProject;
    }),
});
