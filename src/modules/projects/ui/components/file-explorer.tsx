import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { CopyIcon } from "lucide-react";
import { Fragment, useCallback, useMemo, useState } from "react";
import { CodeView } from "./code-view";
import { convertFilesToTreeItems } from "@/lib/utils";
import { TreeView } from "./tee-view";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

type FileCollection ={[path: string]: string}

function getLanguageFromExtension(fileName: string): string {
    const extension = fileName.split(".").pop()?.toLowerCase();
    return extension || "";
}

const FileBreadcrumb = ({path}: {path: string}) => {
    const pathSegments = path.split("/");
    const maxSegments = 4;

    const renderBreadCrumbItems = () => {
        if(pathSegments.length <= maxSegments){
            return pathSegments.map((segment, index) => {
                const isLast = index === pathSegments.length - 1

                return(
                    <Fragment key={index}>
                        <BreadcrumbItem>
                            {isLast?(
                                <BreadcrumbPage className = "font-medium">
                                    {segment}
                                </BreadcrumbPage>
                            ):
                            (
                                <span className="text-muted-foreground">{segment}</span>
                            )
                            }
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator/>}
                    </Fragment>
                )
        })
        }

        else{
            const firstSegment = pathSegments[0];
            const lastSegment = pathSegments[pathSegments.length - 1];

            return(
                <Fragment>
                    <BreadcrumbItem>
                        <span className="text-muted-foreground">{firstSegment}</span>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <span className="text-muted-foreground">{lastSegment}</span>
                    </BreadcrumbItem>
                </Fragment>
            )
        }
    }

    return (
        <Breadcrumb >
        <BreadcrumbList>
        {renderBreadCrumbItems()}
        </BreadcrumbList>
        </Breadcrumb>
    )
}

interface FileExplorerProps{
    files: FileCollection
}

export const FileExplorer = ({files}: FileExplorerProps) => {

    const [selectedFile, setSelectedFile] = useState<string | null>(() => {
        const fileKyes = Object.keys(files);
        return fileKyes.length > 0 ? fileKyes[0] : null;
    });

    const treeData = useMemo(() => {
        return convertFilesToTreeItems(files);
    }, [files])

    const handleFileSelect = useCallback((filePath: string)=>{
        if(files[filePath]){
            setSelectedFile(filePath)
        }
    }, [files])

    return(
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize = {30} minSize={20} className="bg-sidebar">
                <TreeView
                data = {treeData}
                value = {selectedFile}
                onSelect = {handleFileSelect}
                />
            </ResizablePanel>
            <ResizableHandle className="hover:bg-primary transition-colours" />
             <ResizablePanel defaultSize = {70} minSize={50} className="">
                {selectedFile && files[selectedFile]?(
                    <div className="h-full w-full flex flex-col">
                        <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
                            <FileBreadcrumb path={selectedFile}/>
                                <Button size="sm" variant="outline" className="ml-autol" onClick={() => navigator.clipboard.writeText(files[selectedFile] || "")}>
                                    <CopyIcon className="size-4" />
                                </Button>
                        </div>
                        <div className = "flex-1 overflow-auto">
                            <CodeView code = {files[selectedFile]} lang = {getLanguageFromExtension(selectedFile)} />
                        </div>
                        TODO: CodeView
                    </div>
                ): 
                (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        Select a file to view it&apos;s content
                    </div>
                )}
            </ResizablePanel>
        </ResizablePanelGroup>
    )
} 