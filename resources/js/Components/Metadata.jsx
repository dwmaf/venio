import { Icon } from "@iconify/react";

export default function Metadata({
    icon,
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

            <Icon
                icon={icon}
                className={`${textColor} w-10 h-10 lg:w-16 lg:h-16`}
            />
        </div>
    );
}
