import { inngest } from "./client";
import { createAgent, gemini } from "@inngest/agent-kit"

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    const codeAgent = createAgent({
      name: "code-agent",
      system: "You are an expert nextjs developer. You will be given a task to complete. You will only return the code for the task.You write readable, maintainable code. You write simple next.js & react snippets. You do not write complex code. You do not write code that is not needed. You do not write code that is not related to the task.",
      model: gemini({model:"gemini-2.5-flash"}),
    })

    const {output} = await codeAgent.run(`Write the following snippet: ${event.data.value}`)
    console.log("Output:", output)
    return {output}
  },
);
