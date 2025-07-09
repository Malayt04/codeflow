import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useSuspenseQuery } from "@tanstack/react-query";
import {ChevronDownIcon, ChevronLeftIcon, SunMoonIcon } from "lucide-react";
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
        <header className="p-2 flex justify-between items-center border-b">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="focus-visible:ring-0 hover:bg-transparent hover:opacity-75 transition-opacity pl-2">
                            <span className="text-sm font-medium">{project?.name}</span> 
                            <ChevronDownIcon/>
                        </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                        <Link href = "/"/>
                        <ChevronLeftIcon/>
                        <span>Go to Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuSubTrigger className="gap-2">
                        <SunMoonIcon className="size-4 text-muted-foreground"/>
                        <span>Appearence</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent >
                            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}

