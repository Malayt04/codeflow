"use client"

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation} from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  
  const router = useRouter()
  const [value, setValue] = useState("");
  const trpc = useTRPC()
  const createProject = useMutation(trpc.projects.create.mutationOptions({
    onError: (error) => {
      console.error("Error invoking background job:", error);
      toast.error("Error invoking background job");
    },

    onSuccess: (data) => {
      console.log("Background job completed:", data);
      toast.success("Background job completed");
      router.push(`/projects/${data.id}`)
    }
  }))
  return (
    <div className="h-screen w-screen items-center justify-center">
      <div className="max-w-7xl flex items-center flex-col gap-y-4 justify-center">
      <Input onChange={(e) => setValue(e.target.value)} placeholder="Enter your name" value={value}/>
      <Button onClick={() => createProject.mutate({value: value})} disabled={createProject.isPending}>
        Submit
      </Button>
      </div>
    </div>
  );
}

export default Page;