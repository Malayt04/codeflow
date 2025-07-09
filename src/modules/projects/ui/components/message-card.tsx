import { Card } from "@/components/ui/card"
import { Fragment, MessageRole, MessageType } from "@/generated/prisma"
import { cn } from "@/lib/utils"
import {format} from "date-fns"
import { ChevronRightIcon, Code2Icon } from "lucide-react";

interface Props {
    key: string,
    content: string,
    role: MessageRole,
    fragment: Fragment | null,
    createAt: Date,
    isActiveFragment: boolean,
    onFragmentClick: (fragment: Fragment) => void,
    type: MessageType
}

interface UserMessageProps{
    content: string
}

interface AssistantMessageProps{
    content: string
    fragment: Fragment | null,
    isActiveFragment: boolean,
    onFragmentClick: (fragment: Fragment) => void,
    type: MessageType
    createdAt: Date
}

interface FragmentCardProps{
    fragment: Fragment,
    isActiveFragment: boolean,
    onFragmentClick: (fragment: Fragment) => void
}

const FragmentCard = ({fragment, isActiveFragment, onFragmentClick}: FragmentCardProps) => {
    return(
        <button
            className={cn(
                "flex items-start text-start gap-2 border rounded-lg bg-muted w-fit p-3 hover:bg-secondary transition-colors",
                isActiveFragment && "bg-primary text-primary-foreground border-primary hover:bg-primary"
            )}

            onClick={() => onFragmentClick(fragment)}
        >

        <Code2Icon className="size-4 mt-0.5"/>
        <div className="flex flex-col flex-1">
            <span className = "text-sm font-medium">{fragment.title}</span>
            <span className="text-sm">Preview</span>
        </div>
        <div className="flex items-center justify-center mt-0.5">
            <ChevronRightIcon className="size-4"/>
        </div>

        </button>
    )
}

const UserMessage = ({content}: UserMessageProps) => {
    return(
        <div className="flex justify-end pb-4 pr-2 pl-10">
            <Card className="rounded-lg bg-muted p-3 shadow-none border-none max-w-[80%] break-words">
                {content}
            </Card>
        </div>
    )
}

const AssistantMessage = ({content, fragment, isActiveFragment, onFragmentClick, type, createdAt}: AssistantMessageProps) => {
    return(
        <div className={cn(
            "flex flex-col group px-2 pb-4",
            type === "ERROR" && "text-red-700 dark:text-red-500"
        )}>
            <div className="flex items-center gap-2 pl-2 mb-2">
                <span className="text-sm font-medium ">CodeFlow</span>
                <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    {format(createdAt, "HH:mm 'on' MM dd, yyyy")}
                </span>
            </div>

            <div className = "pl-8.5 flex flex-col gap-y-4">
                <span>{content}</span>
                {fragment && type === "RESULT" && (
                    <FragmentCard
                        fragment={fragment}
                        isActiveFragment={isActiveFragment}
                        onFragmentClick={onFragmentClick}
                    />
                )}
            </div>
        </div>
    )
}

export const MessageCard = ({key, content, role, fragment, createAt, isActiveFragment, onFragmentClick, type}: Props) => {
    if(role === "ASSISTANT"){
        return (
            <AssistantMessage 
            content={content}
            fragment={fragment}
            isActiveFragment={isActiveFragment}
            onFragmentClick={onFragmentClick}
            type={type}
            createdAt={createAt}
            />
        )
    }

    return (
        <UserMessage content={content}/>
    )
}