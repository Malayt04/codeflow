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
                    "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
                    isFocused && "shadow-x5",
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
                            className="pt-4 resize-none border-none w-full outline-none bg-transparent"
                            placeholder="Type a message"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    form.handleSubmit(onSubmit)()
                                }
                            }}
                        />
                    )}
                />
                <div className="flex gap-x2 items-end justify-between pt-2">
                    <div className="text-[10px] text-muted-foreground font-mono">
                        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                            <span>&#8984;</span>Enter
                        </kbd>
                        &nbsp; to submit
                    </div>
                    <Button
                        disabled={isDisabled}
                        className={cn(
                            "size-8 rounded-4",
                            isDisabled && "bg-muted-foreground border"
                        )}
                    >
                        <ArrowUpIcon/>
                    </Button>
                </div>
            </form>
        </Form>
    )
}