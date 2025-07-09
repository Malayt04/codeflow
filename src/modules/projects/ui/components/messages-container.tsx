import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { useEffect, useRef } from "react";
import { Fragment } from "@/generated/prisma";

interface Props {
  projectId: string
    activeFragment: Fragment | null
  setActiveFragment: (fragment: Fragment | null) => void
}
export const MessagesContainer = ({ projectId, activeFragment, setActiveFragment }: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null)
  const trpc = useTRPC();
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({ projectId })
  );

  useEffect(() => {
    const lastAssistantMessage = messages.findLast(
      message => message.role === "ASSISTANT"
    )

    if(lastAssistantMessage){
      setActiveFragment(lastAssistantMessage.fragments?.[0] ?? null)
    }
  }, [messages])

    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages.length])
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="pt-2 pr-1">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              content={message.content}
              role={message.role}
              fragment={message.fragments?.[0] ?? null}
              createAt={message.createdAt}
              isActiveFragment={activeFragment?.id === message.fragments?.[0]?.id}
              onFragmentClick={() => setActiveFragment(message.fragments?.[0] ?? null)}
              type={message.type}
            />
          ))}
          <div ref={bottomRef}/>
        </div>
        <div className="relative p-3 pt-1">
          <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent"/>
          <MessageForm projectId={projectId} />
        </div>
      </div>
    </div>
  );
};
