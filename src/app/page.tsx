"use client"

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation} from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Code, Sparkles, Zap, Github, Star, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-violet-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      </div>
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-20" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-2xl blur opacity-30" />
              <div className="relative bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                <Code className="h-8 w-8 text-violet-600" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            CodeFlow
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2 max-w-2xl">
            Transform your ideas into code with AI-powered development
          </p>
          
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl">
            Build, iterate, and deploy faster than ever before
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-to-r from-violet-500 to-purple-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">AI-Powered</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Generate code with advanced AI that understands your requirements</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Real-time code generation and instant preview capabilities</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Full-Stack</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Support for modern frameworks and technologies</p>
            </CardContent>
          </Card>
        </div>

        {/* Main CTA */}
        <div className="w-full max-w-md">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white">
              Start Building
            </h2>
            
            <div className="space-y-4">
              <div className="relative">
                <Input 
                  onChange={(e) => setValue(e.target.value)} 
                  placeholder="Enter your project name" 
                  value={value}
                  className="h-12 pr-12 text-lg border-gray-300 dark:border-gray-600 focus:border-violet-500 focus:ring-violet-500 bg-white dark:bg-gray-700"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Sparkles className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <Button 
                onClick={() => createProject.mutate({value: value})} 
                disabled={createProject.isPending || !value.trim()}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createProject.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Create Project</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1 text-2xl font-bold text-gray-900 dark:text-white mb-1">
              <Star className="h-6 w-6 text-yellow-500" />
              <span>10k+</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Projects Created</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1 text-2xl font-bold text-gray-900 dark:text-white mb-1">
              <Users className="h-6 w-6 text-blue-500" />
              <span>5k+</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Developers</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1 text-2xl font-bold text-gray-900 dark:text-white mb-1">
              <Github className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              <span>Open</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Source</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;