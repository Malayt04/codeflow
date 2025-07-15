"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  projectId: string;
}

const formSchema = z.object({
  value: z.string(),
});

export const MessageForm = ({ projectId }: Props) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { data: usage } = useQuery(trpc.usage.status.queryOptions());
  const showUsage = !!usage;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        form.reset();
        queryClient.invalidateQueries(
          trpc.projects.getOne.queryOptions({ id: projectId })
        );
        queryClient.invalidateQueries(trpc.usage.status.queryOptions());
      },

      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createMessage.mutateAsync({
      value: values.value,
      projectId: projectId,
    });
  };

  const isPending = createMessage.isPending;
  const isDisabled = isPending || !form.formState.isValid;

  return (
    <div className="space-y-4">
      {showUsage && (
        <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Credits remaining: {usage?.remainingPoints || 0}
          </span>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <Textarea
            {...form.register("value")}
            placeholder="Describe what you want to build..."
            className="min-h-[120px] resize-none border-gray-200 dark:border-gray-700 focus:border-violet-500 dark:focus:border-violet-400 transition-colors"
          />
          <div className="absolute bottom-3 right-3">
            <Button
              type="submit"
              size="sm"
              disabled={isDisabled}
              className="h-8 w-8 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
              </div>
  );
};
