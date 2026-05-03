import { Link, usePage } from "@inertiajs/react";
import Tooltip from "./Tooltip";

export default function NavItems({
    page,
    icon: IconComponent,
    className = "",
    text,
    rotate,
    logout = false,
    isSidebarOpen,
}) {
    const { url } = usePage();
    const isActive = url.startsWith(page);

    const baseClass =
        "group relative flex items-center p-4 gap-2 rounded-lg transition-all duration-200 ease-in-out";

    const layoutClass = !isSidebarOpen ? "justify-center" : "";

    const stateClass =
        isActive && !logout ? "bg-blue-50 text-blue-700" : "text-default";

    const hoverClass = logout
        ? "hover:bg-red-50 hover:text-red-700 w-full"
        : "hover:bg-blue-50 hover:text-blue-700";

    const linkClasses = `${baseClass} ${layoutClass} ${stateClass} ${hoverClass}`;

    const textClass = `text-lg leading-none font-body whitespace-nowrap ${
        isActive && !logout ? "font-medium" : ""
    } ${!isSidebarOpen ? "hidden" : ""}`;

    return (
        <Link href={page} className={linkClasses} method={logout ? "post" : "get"} 
        as={logout ? "button" : "a"}>
            <IconComponent
                className={`shrink-0 w-6 h-6 flex items-center justify-center ${className} ${rotate === 2 ? 'rotate-180' : ''}`}
            />

            <span className={textClass}>{text}</span>

            {!isSidebarOpen && <Tooltip text={text} />}
        </Link>
    );
}
