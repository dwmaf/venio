import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";

export default function AdminLayout({ children, title }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isHamMenuOpen, setIsHamMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white flex">
            {/* SIDEBAR */}
            <aside
                className={`hidden lg:flex fixed left-0 top-0 z-30 bg-white border-r border-default/30 transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? "w-81.25" : "w-23"
                } lg:translate-x-0 flex flex-col h-screen`}
            >
                <div className="px-4 py-4 flex items-center justify-between border-b border-slate-700/30">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="flex items-center space-x-3 truncate"
                    >
                        <img
                            src="/venio-icon.png"
                            alt="Logo"
                            className="w-10 h-10 object-contain"
                        />
                        <span
                            className={`font-semibold text-[40px] leading-none tracking-tighter font-['Poppins'] truncate ${!isSidebarOpen && "hidden"}`}
                        >
                            Venio
                        </span>
                    </button>
                    {isSidebarOpen && (
                        <button onClick={() => setIsSidebarOpen(false)}>
                            <Icon
                                icon="solar:sidebar-minimalistic-linear"
                                width="30"
                                height="30"
                                className="text-slate-600 shrink-0"
                            />
                        </button>
                    )}
                </div>

                <nav className="flex-1 mt-4 px-6">
                    <Link
                        href="/dashboard"
                        className="flex items-center py-3 space-x-4"
                    >
                        <Icon
                            icon="duo-icons:dashboard"
                            width="30"
                            height="30"
                            className="text-slate-600 shrink-0"
                        />
                        <span
                            className={`font-normal text[20px] leading-none font-['Plus_Jakarta_Sans'] ${!isSidebarOpen && "hidden"}`}
                        >
                            Dashboard
                        </span>
                    </Link>
                    <Link
                        href="/all-events"
                        className="flex items-center py-3 space-x-4"
                    >
                        <Icon
                            icon="lets-icons:date-fill"
                            width="30"
                            height="30"
                            className="text-slate-600 shrink-0"
                        />
                        <span
                            className={`font-normal text[20px] leading-none font-['Plus_Jakarta_Sans'] ${!isSidebarOpen && "hidden"}`}
                        >
                            Events
                        </span>
                    </Link>
                    <Link
                        href="/all-events"
                        className="flex items-center py-3 space-x-4"
                    >
                        <Icon
                            icon="fluent:mail-unread-20-filled"
                            width="30"
                            height="30"
                            className="text-slate-600 shrink-0"
                        />
                        <span
                            className={`font-normal text[20px] leading-none font-['Plus_Jakarta_Sans'] ${!isSidebarOpen && "hidden"}`}
                        >
                            Mail Logs
                        </span>
                    </Link>
                </nav>

                <div className="px-6 py-6 mt-auto">
                    <button className="w-full flex items-center space-x-4">
                        <Icon
                            icon="solar:logout-3-bold"
                            width="30"
                            height="30"
                            rotate={2}
                            className="text-slate-600 shrink-0"
                        />
                        <span
                            className={`font-normal text[20px] leading-none font-['Plus_Jakarta_Sans'] ${!isSidebarOpen && "hidden"}`}
                        >
                            Logout
                        </span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div
                className={`flex-1 flex flex-col overflow-hidden ${isSidebarOpen ? "lg:ml-81.25" : "lg:ml-23"}`}
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
                        {typeof title !== "undefined" ? title : "Dashboard"}
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
