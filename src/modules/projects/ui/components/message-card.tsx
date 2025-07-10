import { Card } from "@/components/ui/card";
import { Fragment, MessageRole, MessageType } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronRightIcon, Code2Icon } from "lucide-react";

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
    <button
      className={cn(
        "flex items-start text-start gap-3 border rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 w-fit p-4 hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-900 dark:hover:to-purple-900 transition-all duration-300 shadow-sm hover:shadow-md group",
        isActiveFragment &&
          "from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 border-violet-300 dark:border-violet-700 shadow-md"
      )}
      onClick={() => onFragmentClick(fragment)}
    >
      <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
        <Code2Icon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">{fragment.title}</span>
        <span className="text-xs text-gray-600 dark:text-gray-400">Click to preview</span>
      </div>
      <div className="flex items-center justify-center mt-0.5">
        <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" />
      </div>
    </button>
  );
};

const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <div className="flex justify-end pb-6 pr-4 pl-12">
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-4 rounded-2xl rounded-br-md shadow-lg max-w-[80%] break-words">
        <p className="text-sm leading-relaxed">{content}</p>
      </div>
    </div>
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
  return (
    <div
      className={cn(
        "flex flex-col group px-4 pb-4",
        type === "ERROR" && "text-red-700 dark:text-red-500"
      )}
    >
      <div className="flex items-center gap-2 pl-4 mb-3">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-2 rounded-lg shadow-md flex items-center justify-center w-10 h-10">
          <Code2Icon className="h-5 w-5 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          CodeFlow Assistant
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
          {format(createdAt, "HH:mm 'on' MM dd, yyyy")}
        </span>
      </div>

      <div className="pl-14 flex flex-col gap-y-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {content}
          </p>
        </div>
        {fragment && type === "RESULT" && (
          <FragmentCard
            fragment={fragment}
            isActiveFragment={isActiveFragment}
            onFragmentClick={onFragmentClick}
          />
        )}
      </div>
    </div>
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
