import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import NavItems from "@/Components/NavItems";
import Toast from "@/Components/Toast";
import {
    IconSidebarMinimalisticLinear,
    IconSolarLogout3Bold,
    IconJamMenu,
    IconDuoDashboard,
    IconDuoCalendar,
    IconDuoAddCircle,
    IconFluentMailUnread20Filled,
    IconSolarSettingsBroken,
} from "@/Components/Icons";

export default function AdminLayout({ children, title }) {
    const { flash } = usePage().props;
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (flash.success) {
            setToast({ message: flash.success, type: "success" });
        } else if (flash.error) {
            setToast({ message: flash.error, type: "error" });
        }
    }, [flash]);

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
            icon: IconDuoDashboard,
            page: "/dashboard",
            text: "Dashboard",
        },
        {
            icon: IconDuoCalendar,
            page: "/all-events",
            text: "Events",
        },
        {
            icon: IconDuoAddCircle,
            page: "/create-events",
            text: "Add Event",
        },
        {
            icon: IconFluentMailUnread20Filled,
            page: "#",
            text: "Mail Logs",
        },
    ];

    const sidebarWidth = isSidebarOpen ? "w-72" : "w-23";
    const contentMargin = isSidebarOpen ? "lg:ml-72" : "lg:ml-23";

    return (
        <div className="flex min-h-screen bg-white">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            {/* SIDEBAR */}
            <aside
                className={`border-default/30 fixed top-0 left-0 z-30 hidden border-r bg-white transition-all duration-300 lg:flex ${sidebarWidth} flex h-screen flex-col lg:translate-x-0`}
            >
                <div
                    className={`border-default/30 flex items-center border-b py-4 ${!isSidebarOpen ? "justify-center px-4" : "justify-between px-6"}`}
                >
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={`flex items-center ${!isSidebarOpen && "justify-center"} cursor-pointer gap-1`}
                    >
                        <img
                            src="/venio-icon.png"
                            alt="Logo"
                            className="flex h-10 w-10 items-center justify-center object-contain"
                        />
                        <span
                            className={`font-heading text-4xl leading-none font-semibold tracking-tighter ${!isSidebarOpen && "hidden"}`}
                        >
                            Venio
                        </span>
                    </button>
                    {isSidebarOpen && (
                        <button onClick={() => setIsSidebarOpen(false)}>
                            <IconSidebarMinimalisticLinear className="text-default h-6 w-6 cursor-pointer" />
                        </button>
                    )}
                </div>

                <nav className="mt-4 flex-1 space-y-2 px-4">
                    {navLinks.map((item) => (
                        <NavItems
                            key={item.text}
                            {...item}
                            isSidebarOpen={isSidebarOpen}
                        />
                    ))}
                </nav>

                <div className="mt-auto flex items-center p-4">
                    <NavItems
                        icon={IconSolarLogout3Bold}
                        page="/logout"
                        text="Logout"
                        rotate={2}
                        logout={true}
                        isSidebarOpen={isSidebarOpen}
                    />
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div
                className={`flex flex-1 flex-col overflow-hidden ${contentMargin}`}
            >
                {/* Tampilan Mobile - Tablet */}
                <header className="border-default/30 fixed top-0 right-0 left-0 z-50 flex flex-col items-center justify-between border-b bg-white p-3 lg:hidden lg:p-5">
                    <div className="flex w-full items-center justify-between">
                        <img
                            src="/venio-icon.png"
                            alt="Logo"
                            className="h-10 w-10 object-contain"
                        />
                        <button
                            onClick={() => setIsHamMenuOpen(!isHamMenuOpen)}
                        >
                            <IconJamMenu className="h-8 w-8 shrink-0" />
                        </button>
                    </div>

                    {/* Navigasi */}
                    <nav
                        className={`w-full overflow-hidden transition-all duration-500 ease-in-out ${isHamMenuOpen ? "mt-4 max-h-96" : "mt-0 max-h-0"}`}
                    >
                        <Link
                            href="/dashboard"
                            className="flex items-center space-x-2 p-2"
                        >
                            <IconDuoDashboard className="text-default h-6 w-6 shrink-0" />
                            <span
                                className={`text[20px] font-['Plus_Jakarta_Sans'] leading-none font-normal`}
                            >
                                Dashboard
                            </span>
                        </Link>
                        <Link
                            href="/all-events"
                            className="flex items-center space-x-2 p-2"
                        >
                            <IconDuoCalendar className="text-default h-6 w-6 shrink-0" />
                            <span
                                className={`text[20px] font-['Plus_Jakarta_Sans'] leading-none font-normal`}
                            >
                                Events
                            </span>
                        </Link>
                        <Link
                            href="/create-events"
                            className="flex items-center space-x-2 p-2"
                        >
                            <IconDuoAddCircle className="text-default h-6 w-6 shrink-0" />
                            <span
                                className={`text[20px] font-['Plus_Jakarta_Sans'] leading-none font-normal`}
                            >
                                Add Events
                            </span>
                        </Link>
                        <Link
                            href="/all-events"
                            className="flex items-center space-x-2 p-2"
                        >
                            <IconFluentMailUnread20Filled className="text-default h-6 w-6 shrink-0" />
                            <span
                                className={`text[20px] font-['Plus_Jakarta_Sans'] leading-none font-normal`}
                            >
                                Mail Logs
                            </span>
                        </Link>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex items-center space-x-2 p-2"
                        >
                            <IconSolarLogout3Bold className="text-default h-6 w-6 shrink-0 rotate-180" />
                            <span
                                className={`text[20px] font-['Plus_Jakarta_Sans'] leading-none font-normal`}
                            >
                                Logout
                            </span>
                        </Link>
                    </nav>
                </header>

                {/* Tampilan Desktop */}
                <header className="border-default/30 hidden items-center justify-between border-b bg-white p-5 lg:flex">
                    <h2 className="font-heading text-[32px] leading-none font-medium">
                        {title ?? "Dashboard"}
                    </h2>
                    <IconSolarSettingsBroken className="h-8 w-8 shrink-0" />
                </header>

                <main className="flex-1 overflow-y-auto px-4 pt-20 pb-4 md:px-6 md:pb-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
