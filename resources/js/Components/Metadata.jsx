export default function Metadata({
    icon: IconComponent,
    title,
    data,
    className = "",
    textColor = "",
}) {
    return (
        <div
            className={`flex flex-1 justify-between items-center rounded-2xl py-4 px-6 ${className} gap-2`}
        >
            <div className="flex flex-col gap-2.5 font-body text-base lg:text-xl leading-none">
                <span className="font-medium">{title}</span>
                <span className="text-neutral">{data}</span>
            </div>
            <IconComponent 
                className={`${textColor} w-8 h-8 lg:w-10 lg:h-10 aspect-square`} 
            />
        </div>
    );
}
