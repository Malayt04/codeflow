"use client"

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

const Page = () => {
  
  const trpc = useTRPC()
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess: () => {
      console.log("Background job invoked successfully");
    },
    onError: (error) => {
      console.error("Error invoking background job:", error);
    }
  }))
  return (
    <>
      <Button onClick={() => invoke.mutate({text: "Malay"})} disabled={invoke.isPending}>
        Invoke Background Job
      </Button>
    </>
  );
}

export default Page;