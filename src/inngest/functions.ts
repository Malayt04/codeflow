import { inngest } from "./client";
import {
  createAgent,
  createNetwork,
  createTool,
  openai,
} from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import { z } from "zod";
import { PROMPT } from "@/prompt";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

// Inngest function
export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    // Step 1: Create sandbox
    const sandboxId = await step.run("Create sandbox", async () => {
      const sandbox = await Sandbox.create("codeflow-nextjs-template");
      return sandbox.sandboxId;
    });

    // Step 2: Create tools
    const terminalTool = createTool({
      name: "terminal",
      description: "Run shell commands in the sandbox",
      parameters: z.object({
        command: z.string(),
      }),
      handler: async ({ command }, { step }) => {
        console.log("Running terminal command:", command);

        if (!step) {
          // Fallback when step is not available
          try {
            const sandbox = await getSandbox(sandboxId);
            let output = "";
            await sandbox.commands.run(command, {
              onStdout: (data) => {
                output += data.toString();
              },
              onStderr: (data) => {
                output += data.toString();
              },
            });
            return output;
          } catch (error) {
            console.error("Terminal error:", error);
            throw new Error(
              `Terminal command failed: ${
                error instanceof Error ? error.message : String(error)
              }`
            );
          }
        }

        return await step.run("Run terminal command", async () => {
          try {
            const sandbox = await getSandbox(sandboxId);
            let output = "";
            await sandbox.commands.run(command, {
              onStdout: (data) => {
                output += data.toString();
              },
              onStderr: (data) => {
                output += data.toString();
              },
            });
            return output;
          } catch (error) {
            console.error("Terminal error:", error);
            throw new Error(
              `Terminal command failed: ${
                error instanceof Error ? error.message : String(error)
              }`
            );
          }
        });
      },
    });

    const createOrUpdateFileTool = createTool({
      name: "createOrUpdateFile",
      description: "Create or update files in the sandbox",
      parameters: z.object({
        files: z.array(
          z.object({
            path: z.string(),
            content: z.string(),
          })
        ),
      }),
      handler: async ({ files }, { step, network }) => {
        console.log("Creating/updating files:", files);

        if (!step) {
          // Fallback when step is not available
          try {
            const sandbox = await getSandbox(sandboxId);
            const updatedFiles = network?.state.kv.get("files") || {};
            for (const file of files) {
              await sandbox.files.write(file.path, file.content);
              updatedFiles[file.path] = file.content;
            }
            network?.state.kv.set("files", updatedFiles);
            return updatedFiles;
          } catch (error) {
            throw new Error(
              "File update failed: " +
                (error instanceof Error ? error.message : String(error))
            );
          }
        }

        return await step.run("Create/update files", async () => {
          try {
            const sandbox = await getSandbox(sandboxId);
            const updatedFiles = network?.state.kv.get("files") || {};
            for (const file of files) {
              await sandbox.files.write(file.path, file.content);
              updatedFiles[file.path] = file.content;
            }
            network?.state.kv.set("files", updatedFiles);
            return updatedFiles;
          } catch (error) {
            throw new Error(
              "File update failed: " +
                (error instanceof Error ? error.message : String(error))
            );
          }
        });
      },
    });

    // Step 3: Create agent
    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      description: "An agent that can code using terminal, file operations",
      system: PROMPT,
      model: openai({
        model: "gpt-4.1",
        apiKey: process.env.OPENAI_API_KEY,
        defaultParameters: {
          temperature: 0.2,
          max_completion_tokens: 32768,
        },
      }),
      tools: [terminalTool, createOrUpdateFileTool],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          console.log(
            "Agent response received:",
            result.toolCalls.map((call) => ({
              tool: call.tool.name,
              content: call.content,
              parameters: call.stop_reason,
            }))
          );
          const message = lastAssistantTextMessageContent(result);
          if (network && message?.includes("<task_summary>")) {
            network.state.kv.set("summary", message);
          }
          console.log("Agent response:", message);
          return result;
        },
      },
    });

    // Step 4: Create network and route to code agent
    const network = createNetwork({
      name: "code-agent-network",
      agents: [codeAgent],
      maxIter: 2,
      router: async () => {
        // Always route to the code agent in this case
        return codeAgent;
      },
    });

    // Step 5: Run the network with the user input
    const result = await network.run(event.data.value);

    const isError =
      !result.state.kv.get("summary") ||
      Object.keys(result.state.kv.get("files") || {}).length === 0;

    // Step 6: Get sandbox URL (assuming app runs on port 3000)
    const sandboxUrl = await step.run("Get sandbox URL", async () => {
      const sandbox = await getSandbox(sandboxId);
      return `http://${sandbox.getHost(3000)}`;
    });

    await step.run("save-result", async () => {
      await prisma.project.update({
        where: { id: event.data.projectId },
        data: { isBuilding: false },
      });

      if (isError) {
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "Something is wrong, please try again",
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      } else {
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: result.state.kv.get("summary")!,
            role: "ASSISTANT",
            type: "RESULT",
            fragments: {
              create: {
                sandboxUrl: sandboxUrl,
                title: "Fragment",
                files: result.state.kv.get("files") ?? {},
              },
            },
          },
        });
      }
    });

    // Step 7: Return the result
    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.kv.get("files"),
      summary: result.state.kv.get("summary"),
    };
  }
);
