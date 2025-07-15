import { Card } from "@/components/ui/card";
import { Fragment, MessageRole, MessageType } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ChevronRightIcon,
  Code2Icon,
  User,
  Bot,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  content: string;
  role: MessageRole;
  fragment: Fragment | null;
  createAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  type: MessageType;
}

interface UserMessageProps {
  content: string;
}

interface AssistantMessageProps {
  content: string;
  fragment: Fragment | null;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  type: MessageType;
  createdAt: Date;
}

interface FragmentCardProps {
  fragment: Fragment;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}

const FragmentCard = ({
  fragment,
  isActiveFragment,
  onFragmentClick,
}: FragmentCardProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "flex items-start text-start gap-4 border rounded-2xl bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-sm w-fit p-5 hover:from-violet-50/90 hover:to-purple-50/90 dark:hover:from-violet-900/90 dark:hover:to-purple-900/90 transition-all duration-300 shadow-lg hover:shadow-xl group relative overflow-hidden",
        isActiveFragment &&
          "from-violet-100/90 to-purple-100/90 dark:from-violet-900/90 dark:to-purple-900/90 border-violet-300/50 dark:border-violet-600/50 shadow-xl ring-2 ring-violet-500/20"
      )}
      onClick={() => onFragmentClick(fragment)}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 bg-white/90 dark:bg-gray-800/90 p-3 rounded-xl shadow-md border border-gray-200/50 dark:border-gray-600/50 group-hover:scale-110 transition-transform duration-300">
        <Code2Icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
      </div>
      <div className="flex flex-col flex-1 relative z-10">
        <span className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
          {fragment.title}
        </span>
        <span className="text-xs text-gray-600 dark:text-gray-400">
          Click to preview
        </span>
      </div>
      <div className="flex items-center justify-center mt-1 relative z-10">
        <motion.div
          animate={{ x: isActiveFragment ? 2 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" />
        </motion.div>
      </div>
    </motion.button>
  );
};

const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-end pb-6 pr-4 pl-12"
    >
      <div className="flex items-end space-x-3 max-w-[80%]">
        <div className="bg-gradient-to-r from-violet-600 to-blue-600 text-white p-4 rounded-2xl rounded-br-md shadow-xl max-w-full break-words relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-blue-600/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
          <p className="text-sm leading-relaxed relative z-10">{content}</p>
        </div>
        <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
          <User className="h-4 w-4 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

const AssistantMessage = ({
  content,
  fragment,
  isActiveFragment,
  onFragmentClick,
  type,
  createdAt,
}: AssistantMessageProps) => {
  const getStatusIcon = () => {
    switch (type) {
      case "ERROR":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "RESULT":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Code2Icon className="h-4 w-4 text-violet-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "flex flex-col group px-4 pb-4",
        type === "ERROR" && "text-red-700 dark:text-red-500"
      )}
    >
      <div className="flex items-center gap-3 pl-4 mb-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="bg-gradient-to-r from-violet-600 to-blue-600 p-2.5 rounded-xl shadow-lg flex items-center justify-center w-10 h-10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-blue-600/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
          <Bot className="h-5 w-5 text-white relative z-10" />
        </motion.div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            CodeFlow Assistant
          </span>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {format(createdAt, "HH:mm 'on' MM dd, yyyy")}
            </span>
          </div>
        </div>
      </div>

      <div className="pl-14 flex flex-col gap-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50"
        >
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {content}
          </p>
        </motion.div>
        <AnimatePresence>
          {fragment && type === "RESULT" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.3 }}
            >
              <FragmentCard
                fragment={fragment}
                isActiveFragment={isActiveFragment}
                onFragmentClick={onFragmentClick}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const MessageCard = ({
  content,
  role,
  fragment,
  createAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: Props) => {
  if (role === "ASSISTANT") {
    return (
      <AssistantMessage
        content={content}
        fragment={fragment}
        isActiveFragment={isActiveFragment}
        onFragmentClick={onFragmentClick}
        type={type}
        createdAt={createAt}
      />
    );
  }

  return <UserMessage content={content} />;
};
