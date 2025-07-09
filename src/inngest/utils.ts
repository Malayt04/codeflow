import {Sandbox} from "@e2b/code-interpreter";
import { AgentResult, TextMessage } from "@inngest/agent-kit";

export async function getSandbox (sandboxId: string){
  const sandbox = await Sandbox.connect(sandboxId);
  return sandbox;
}

export function lastAssistantTextMessageContent(result: AgentResult): string | undefined {
    const lastMessageIndex = result.output.findLastIndex((message) => message.role === "assistant");
    const message = result.output[lastMessageIndex] as TextMessage || undefined;
    if (!message?.content) return undefined;
    if (typeof message.content === "string") return message.content;
    return message.content.map((c) => c.text).join("");
}