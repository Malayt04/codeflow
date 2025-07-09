interface Props {
    params: Promise<{
        projectId: string
    }>
}

const Page = async ({params}: Props) => {

    const {projectId} = await params
    return (
        <div className="h-screen w-screen items-center justify-center">
            <div className="max-w-7xl flex items-center flex-col gap-y-4 justify-center">
                <h1>Project {projectId}</h1>
            </div>
        </div>
    )
}

export default Page