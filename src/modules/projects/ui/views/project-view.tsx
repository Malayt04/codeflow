"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MessagesContainer } from "../components/messages-container";
import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma";
import { FragmentWeb } from "../components/fragment-web";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { ProjectHeader } from "../components/project-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CodeIcon, EyeIcon, FileCode, Globe } from "lucide-react";
import { FileExplorer } from "../components/file-explorer";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");

  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <ProjectHeader projectId={projectId} />
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800"
        >
          <Suspense
            fallback={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-full"
              >
                <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full"
                  />
                  <span>Loading Messages...</span>
                </div>
              </motion.div>
            }
          >
            <MessagesContainer
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
              projectId={projectId}
              messages={project.message}
              isLoading={project.isBuilding}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle
          withHandle
          className="bg-transparent hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors duration-200"
        />
        <ResizablePanel
          defaultSize={65}
          minSize={20}
          className="flex flex-col min-h-0 bg-white dark:bg-gray-900"
        >
          <Tabs
            className="h-full flex flex-col"
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code")}
          >
            <div className="w-full flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <TabsList className="h-10 p-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                <TabsTrigger
                  value="preview"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-violet-600 dark:data-[state=active]:text-violet-400 data-[state=active]:shadow-sm transition-all text-sm font-medium"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span>Preview</span>
                </TabsTrigger>
                <TabsTrigger
                  value="code"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-violet-600 dark:data-[state=active]:text-violet-400 data-[state=active]:shadow-sm transition-all text-sm font-medium"
                >
                  <CodeIcon className="h-4 w-4" />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent
              value="preview"
              className="flex-1 m-0 p-0 bg-white dark:bg-gray-900"
            >
              <AnimatePresence mode="wait">
                {activeFragment ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <FragmentWeb data={activeFragment} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-preview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center justify-center h-full"
                  >
                    <div className="text-center max-w-md mx-auto p-8">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-20 h-20 bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-900 dark:to-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                      >
                        <Globe className="h-10 w-10 text-violet-500 dark:text-violet-400" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        No preview available
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        Send a message to generate a code fragment and see the
                        preview here.
                      </p>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          💡 Try asking: "Create a React component with a
                          button"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
            <TabsContent
              value="code"
              className="flex-1 m-0 p-0 min-h-0 bg-white dark:bg-gray-900"
            >
              <AnimatePresence mode="wait">
                {!!activeFragment?.files ? (
                  <motion.div
                    key="code-view"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <FileExplorer
                      files={activeFragment.files as { [path: string]: string }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-code"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center justify-center h-full"
                  >
                    <div className="text-center max-w-md mx-auto p-8">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-20 h-20 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                      >
                        <FileCode className="h-10 w-10 text-blue-500 dark:text-blue-400" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        No code available
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        Generate code by sending a message, then view and edit
                        it here.
                      </p>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          💡 Generated code will appear as an interactive file
                          explorer
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
