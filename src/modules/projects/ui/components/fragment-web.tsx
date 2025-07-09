import { Button } from "@/components/ui/button"
import { Fragment } from "@/generated/prisma"
import {RefreshCcwIcon } from "lucide-react"
import { useState } from "react"

interface Props {
    data: Fragment
}

export const FragmentWeb = ({data}: Props) => {

    const [fragmentKey, setFragmentKey] = useState(0);
    const [copied, setCopied] = useState(false);

    const onRefresh = () => {
        setFragmentKey(fragmentKey + 1);
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(data.sandboxUrl);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }
    return (
        
        <div className="flex flex-col w-full h-full">
            <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
                <Button size="sm" variant="outline" onClick={onRefresh}>
                    <RefreshCcwIcon/>
                </Button>

                <Button size="sm" variant="outline" className="flex-1 justify-start text-start font-normal" disabled = {!data.sandboxUrl} onClick={handleCopy}>
                    <span>{data.sandboxUrl}</span>
                </Button>

                

            </div>
            <iframe
            key={fragmentKey}
            className="h-full w-full"
            sandbox="allow-forms allow-scripts allow-same-origin"
            loading="lazy"
            src={data.sandboxUrl}
            />
        </div>
    )
}