import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import NavItems from "@/Components/NavItems";

export default function AdminLayout({ children, title }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        const sidebarOpen = localStorage.getItem("sidebarOpen");
        return sidebarOpen === "true";
    });

    const [isHamMenuOpen, setIsHamMenuOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("sidebarOpen", isSidebarOpen);
    }, [isSidebarOpen]);

    const navLinks = [
        {
            icon: "duo-icons:dashboard",
            page: "/dashboard",
            text: "Dashboard",
        },
        {
            icon: "duo-icons:calendar",
            page: "/all-events",
            text: "Events",
        },
        {
            icon: "duo-icons:add-circle",
            page: "/create-events",
            text: "Add Event",
        },
        {
            icon: "duo-icons:clipboard",
            page: "#",
            text: "Mail Logs",
        },
    ];

    const sidebarWidth = isSidebarOpen ? "w-81.25" : "w-23";
    const contentMargin = isSidebarOpen ? "lg:ml-81.25" : "lg:ml-23";

    return (
        <div className="min-h-screen bg-white flex">
            {/* SIDEBAR */}
            <aside
                className={`hidden lg:flex fixed left-0 top-0 z-30 bg-white border-r border-default/30 transition-all duration-300 ${sidebarWidth} lg:translate-x-0 flex flex-col h-screen`}
            >
                <div
                    className={`py-4 flex items-center border-b border-default/30 ${!isSidebarOpen ? "justify-center px-4" : "justify-between px-6"}`}
                >
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={`flex items-center ${!isSidebarOpen && "justify-center"} gap-1 cursor-pointer`}
                    >
                        <img
                            src="/venio-icon.png"
                            alt="Logo"
                            className="w-10 h-10 object-contain flex items-center justify-center"
                        />
                        <span
                            className={`font-semibold text-4xl leading-none tracking-tighter font-heading ${!isSidebarOpen && "hidden"}`}
                        >
                            Venio
                        </span>
                    </button>
                    {isSidebarOpen && (
                        <button onClick={() => setIsSidebarOpen(false)}>
                            <Icon
                                icon="solar:sidebar-minimalistic-linear"
                                className="text-default w-6 h-6 cursor-pointer"
                            />
                        </button>
                    )}
                </div>

                <nav className="flex-1 mt-4 px-4 space-y-2">
                    {navLinks.map((item) => (
                        <NavItems
                            key={item.text}
                            {...item}
                            isSidebarOpen={isSidebarOpen}
                        />
                    ))}
                </nav>

                <div className="p-4 mt-auto flex items-center">
                    <NavItems
                        icon="solar:logout-3-bold"
                        page="#"
                        text="Logout"
                        rotate={2}
                        logout={true}
                        isSidebarOpen={isSidebarOpen}
                    />
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div
                className={`flex-1 flex flex-col overflow-hidden ${contentMargin}`}
            >
                {/* Tampilan Mobile - Tablet */}
                <header className="lg:hidden bg-white fixed top-0 left-0 right-0 z-50 flex flex-col items-center p-3 lg:p-5 border-b border-default/30 justify-between">
                    <div className="w-full flex items-center justify-between">
                        <img
                            src="/venio-icon.png"
                            alt="Logo"
                            className="w-10 h-10 object-contain"
                        />
                        <button
                            onClick={() => setIsHamMenuOpen(!isHamMenuOpen)}
                        >
                            <Icon
                                icon="jam:menu"
                                width="32"
                                height="32"
                                className="shrink-0"
                            />
                        </button>
                    </div>

                    {/* Navigasi */}
                    <nav
                        className={`w-full overflow-hidden transition-all duration-500 ease-in-out ${isHamMenuOpen ? "max-h-96 mt-4" : "max-h-0 mt-0"}`}
                    >
                        <Link
                            href="/dashboard"
                            className="flex items-center space-x-2 p-2"
                        >
                            <Icon
                                icon="duo-icons:dashboard"
                                className="text-slate-600 shrink-0 w-6 h-6"
                            />
                            <span
                                className={`font-normal text[20px] leading-none font-['Plus_Jakarta_Sans']`}
                            >
                                Dashboard
                            </span>
                        </Link>
                        <Link
                            href="/all-events"
                            className="flex items-center space-x-2 p-2"
                        >
                            <Icon
                                icon="lets-icons:date-fill"
                                className="text-slate-600 shrink-0 w-6 h-6"
                            />
                            <span
                                className={`font-normal text[20px] leading-none font-['Plus_Jakarta_Sans']`}
                            >
                                Events
                            </span>
                        </Link>
                        <Link
                            href="/all-events"
                            className="flex items-center space-x-2 p-2"
                        >
                            <Icon
                                icon="fluent:mail-unread-20-filled"
                                className="text-slate-600 shrink-0 w-6 h-6"
                            />
                            <span
                                className={`font-normal text[20px] leading-none font-['Plus_Jakarta_Sans']`}
                            >
                                Mail Logs
                            </span>
                        </Link>
                    </nav>
                </header>

                {/* Tampilan Desktop */}
                <header className="bg-white hidden lg:flex items-center p-5 border-b border-default/30 justify-between">
                    <h2 className="font-heading font-medium text-[32px] leading-none">
                        {title ?? "Dashboard"}
                    </h2>
                    <Icon
                        icon="solar:settings-broken"
                        width="32"
                        height="32"
                        className="shrink-0"
                    />
                </header>

                <main className="flex-1 overflow-y-auto pt-20 pb-4 px-4 md:px-6 md:pb-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
