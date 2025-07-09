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
interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {

  const [activeFragment, setAcrtiveFragment] = useState<Fragment | null>(null);

  const trpc = useTRPC ();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-co<l min-h-0"
        >
          <Suspense fallback={<div>Loading Messages...</div>}>
            <MessagesContainer
              activeFragment={activeFragment}
              setActiveFragment = {setAcrtiveFragment}
            projectId={projectId} />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle={true} />
        <ResizablePanel
          defaultSize={65}
          minSize={20}
          className="flex flex-col min-h-0"
        >
        {activeFragment && <FragmentWeb data = {activeFragment}/>}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
