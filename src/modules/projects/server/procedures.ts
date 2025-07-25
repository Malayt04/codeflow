import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { inngest } from "../../../inngest/client";
import { PrismaClient } from "@/generated/prisma";
import {generateSlug} from "random-word-slugs";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

export const projectsRouter = createTRPCRouter({

    getOne: protectedProcedure
    .input(
        z.object({
        id: z.string().min(1, {message:"Project ID is required"}),
    }))
    .query(async ({input, ctx}) => {
        const existingProject = await prisma.project.findUnique({
            where: {
                id: input.id,
                userId: ctx.auth.userId
            },
            include: {
                message: {
                    include: {
                        fragments: true
                    }
                }
            }
        })

        if (!existingProject) {
            throw new TRPCError({code:"NOT_FOUND", message:"Project not found"})
        }

        return existingProject
    }),
  getMany: protectedProcedure.query(async (
    { ctx }
  ) => {
    const projects = await prisma.project.findMany({
      where: {
        userId: ctx.auth.userId
      },
      orderBy: {
        updatedAt: "asc",
      },
    });
    return projects;
  }),
  create: protectedProcedure
    .input(
      z.object({
        value: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {

        const createdProject = await prisma.project.create({
          data: {
            userId: ctx.auth.userId,
            name: generateSlug(2, {
                format: "kebab",
            }),
            isBuilding: true,
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