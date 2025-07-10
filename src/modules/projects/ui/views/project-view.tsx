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
import { CodeIcon, CrownIcon, EyeIcon, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeView } from "../components/code-view";
import { FileExplorer } from "../components/file-explorer";

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
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <ProjectHeader projectId={projectId} />
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
        >
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-violet-600" />
                <span>Loading Messages...</span>
              </div>
            </div>
          }>
            <MessagesContainer
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
              projectId={projectId}
              messages={project.message}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-gray-200 dark:bg-gray-700 hover:bg-violet-200 dark:hover:bg-violet-800 transition-colors" />
        <ResizablePanel
          defaultSize={65}
          minSize={20}
          className="flex flex-col min-h-0 bg-white dark:bg-gray-800"
        >
          <Tabs className="h-full flex flex-col" defaultValue="preview" value={tabState} onValueChange={(value) => setTabState(value as "preview" | "code")}>
            <div className="w-full flex items-center px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <TabsList className="h-9 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                <TabsTrigger value="preview" className="flex items-center space-x-2 px-4 py-2 rounded-md data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-900 dark:data-[state=active]:text-violet-300 transition-all">
                  <EyeIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Preview</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center space-x-2 px-4 py-2 rounded-md data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-900 dark:data-[state=active]:text-violet-300 transition-all">
                  <CodeIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                <Button asChild size="sm" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-sm">
                  <Link href="/pricing" className="flex items-center space-x-2">
                    <CrownIcon className="h-4 w-4" />
                    <span>Upgrade</span>
                  </Link>
                </Button>
              </div>
            </div>
            <TabsContent value="preview" className="flex-1 m-0 p-0 bg-white dark:bg-gray-800">
              {activeFragment ? (
                <FragmentWeb data={activeFragment} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
                      <EyeIcon className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No preview available</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Send a message to generate a code fragment and see the preview here.</p>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400">💡 Try asking: "Create a React component with a button"</p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="code" className="flex-1 m-0 p-0 min-h-0 bg-white dark:bg-gray-800">
              {!!activeFragment?.files ? (
                <FileExplorer files={activeFragment.files as {[path: string]: string}} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CodeIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No code available</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Generate code by sending a message, then view and edit it here.</p>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400">💡 Generated code will appear as an interactive file explorer</p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
