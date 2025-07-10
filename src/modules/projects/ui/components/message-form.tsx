// src/modules/projects/ui/components/message-form.tsx
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import TextareaAutosize from "react-textarea-autosize"
import { z } from "zod"
import { Form, FormField } from "@/components/ui/form"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUpIcon } from "lucide-react"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Props{
    projectId: string
}

const formSchema = z.object({
    value: z.string(),
})

export const MessageForm = ({projectId}: Props) => {
    const queryClient = useQueryClient()
    const [isFocused, setIsFocused] = useState(false)
    const showUsage = false
    const trpc = useTRPC()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: "",
        },
    })
    
    const createMessage = useMutation(trpc.messages.create.mutationOptions({
        onSuccess: (data) => {
            form.reset()
            queryClient.invalidateQueries(trpc.projects.getOne.queryOptions({id: projectId}))
        },

        onError: (error) => {
            toast.error(error.message)
        }
    }))
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await createMessage.mutateAsync({
            value: values.value,
            projectId: projectId
        })
    }

    const isPending = createMessage.isPending
    const isDisabled = isPending || !form.formState.isValid

    return (
        <Form {...form}>
            <form
                onSubmit = {form.handleSubmit(onSubmit)}
                className={cn(
                    "relative border border-gray-200 dark:border-gray-700 p-4 rounded-2xl bg-white dark:bg-gray-800 transition-all shadow-sm",
                    isFocused && "shadow-lg ring-2 ring-violet-500/20",
                    showUsage && "rounded-t-none"
                )}
            >
                <FormField
                    name="value"
                    control={form.control}
                    render={({ field }) => (
                        <TextareaAutosize
                            {...field}
                            disabled={isPending}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            minRows = {2}
                            maxRows = {8}
                            className="resize-none border-none w-full outline-none bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm leading-relaxed"
                            placeholder="Ask me to create something amazing..."
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    form.handleSubmit(onSubmit)()
                                }
                            }}
                        />
                    )}
                />
                <div className="flex gap-x-2 items-end justify-between pt-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                        <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-1.5 font-mono text-[10px] font-medium text-gray-600 dark:text-gray-400">
                            <span>⌘</span>Enter
                        </kbd>
                        <span>to submit</span>
                    </div>
                    <Button
                        disabled={isDisabled}
                        className={cn(
                            "w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md transition-all",
                            isDisabled && "opacity-50 cursor-not-allowed from-gray-400 to-gray-500"
                        )}
                    >
                        {isPending ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        ) : (
                            <ArrowUpIcon className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}