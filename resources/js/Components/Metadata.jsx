export default function Metadata({
    icon: IconComponent,
    title,
    data,
    className = "",
    textColor = "",
}) {
    return (
        <div
            className={`flex flex-1 items-center justify-between rounded-2xl px-6 py-4 ${className} gap-2`}
        >
            <div className="font-body flex flex-col gap-2.5 text-base leading-none text-white lg:text-xl">
                <span className="text-zinc-100">{title}</span>
                <span className="font-medium">{data}</span>
            </div>
            <IconComponent
                className={`${textColor} aspect-square h-8 w-8 lg:h-10 lg:w-10`}
            />
        </div>
    );
}
