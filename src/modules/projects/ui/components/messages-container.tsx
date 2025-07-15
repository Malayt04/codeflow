import { useEffect, useRef } from "react";
import { Fragment, Message } from "@/generated/prisma";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";

interface Props {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
  messages: (Message & { fragments: Fragment[] | null })[];
  isLoading: boolean;
}

export const MessagesContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
  messages,
  isLoading,
}: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastAssistantMessage = messages.findLast(
      (message) => message.role === "ASSISTANT"
    );

    if (lastAssistantMessage) {
      setActiveFragment(lastAssistantMessage.fragments?.[0] ?? null);
    }
  }, [messages, setActiveFragment]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full bg-gray-50/50 dark:bg-gray-900/50">
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col-reverse">
        <div className="p-4 space-y-4">
          <div ref={bottomRef} />
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <MessageCard
                  content={message.content}
                  role={message.role}
                  fragment={message.fragments?.[0] ?? null}
                  createAt={message.createdAt}
                  isActiveFragment={
                    activeFragment?.id === message.fragments?.[0]?.id
                  }
                  onFragmentClick={() =>
                    setActiveFragment(message.fragments?.[0] ?? null)
                  }
                  type={message.type}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-start space-x-4 p-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <Bot className="h-5 w-5 text-white" />
                </motion.div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-24 rounded" />
                    <div className="flex space-x-1">
                      <motion.div
                        className="w-2 h-2 bg-violet-500 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-blue-500 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-cyan-500 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-4 w-1/2 rounded" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="p-4 border-t border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};
