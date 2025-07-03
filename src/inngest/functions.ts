import { inngest } from "./client";
import { createAgent, gemini } from "@inngest/agent-kit"
import {Sandbox} from "@e2b/code-interpreter";
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("Create sandbox", async () => {
      const sandbox = await Sandbox.create("codeflow-nextjs-template")
      return sandbox.sandboxId
    })
    const codeAgent = createAgent({
      name: "code-agent",
      system: "You are an expert nextjs developer. You will be given a task to complete. You will only return the code for the task.You write readable, maintainable code. You write simple next.js & react snippets. You do not write complex code. You do not write code that is not needed. You do not write code that is not related to the task.",
      model: gemini({model:"gemini-2.5-flash"}),
    })

    const {output} = await codeAgent.run(`Write the following snippet: ${event.data.value}`)
    console.log("Output:", output)

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId)
      const host = sandbox.getHost(3000)
      return `http://${host}`
    })
    return {output, sandboxUrl}
  },
);
