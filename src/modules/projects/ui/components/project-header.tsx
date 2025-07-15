import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronDownIcon, Home, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  projectId: string;
}

export const ProjectHeader = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 px-6 py-4 z-10 relative shadow-sm"
    >
      <div className="flex items-center justify-between w-full min-w-0">
        {/* Left: Project Name Dropdown */}
        <div className="flex items-center space-x-4 min-w-0">
          {/* Project Name Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 rounded-lg min-w-0"
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                      {project?.name}
                    </span>
                    <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-500 transition-transform duration-200" />
                  </div>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
            >
              <DropdownMenuItem asChild>
                <a
                  href="/"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Home className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm">Go to Dashboard</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ExternalLink className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm">Export Project</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Right: (Intentionally left blank for clean look) */}
        <div />
      </div>
    </motion.header>
  );
};
