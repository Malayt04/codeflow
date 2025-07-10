import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSuspenseQuery } from "@tanstack/react-query";
import {ChevronDownIcon, ChevronLeftIcon, SunMoonIcon, Code, Settings, Home } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

interface Props{
    projectId: string
}

export const ProjectHeader = ({ projectId }: Props) => {

    const trpc = useTRPC();
    const {data: project} = useSuspenseQuery(trpc.projects.getOne.queryOptions({id: projectId}))
    const {setTheme, theme} = useTheme()
    return(
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity" />
                            <div className="relative bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <Code className="h-5 w-5 text-violet-600" />
                            </div>
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                            CodeFlow
                        </span>
                    </Link>
                    
                    {/* Project info */}
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-400">/</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{project?.name}</span>
                                    <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48">
                                <DropdownMenuItem asChild>
                                    <Link href="/" className="flex items-center space-x-2">
                                        <Home className="h-4 w-4" />
                                        <span>Go to Dashboard</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="flex items-center space-x-2">
                                        <SunMoonIcon className="h-4 w-4 text-muted-foreground"/>
                                        <span>Appearance</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                                <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                
                {/* Right side actions */}
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </header>
    )
}
