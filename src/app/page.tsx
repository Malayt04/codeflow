"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const Page = () => {
  
  const [value, setValue] = useState("");
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
      <Input onChange={(e) => setValue(e.target.value)} placeholder="Enter your name" value={value}/>
      <Button onClick={() => invoke.mutate({value: value})} disabled={invoke.isPending}>
        Invoke Background Job
      </Button>
    </>
  );
}

export default Page;