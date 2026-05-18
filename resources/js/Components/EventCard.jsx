import {
    IconDuoCalendar,
    IconDuoClock,
    IconDuoLocation,
    IconDuoAward,
    IconDuoUser,
    IconDuoHandshake
} from "@/Components/Icons";
import { formatTanggalSlash, formatJamMenit } from "@/utils/format";
import { Link } from "@inertiajs/react";

export function NoEvent({ inner = false }) {
    return (
        <div
            className={`font-heading text-neutral flex h-full min-h-36 max-w-screen flex-col items-center justify-center gap-8 text-xl leading-none font-medium md:flex-1 lg:text-2xl ${!inner && "border-default/30 relative overflow-hidden rounded-2xl border p-4 lg:p-8"}`}
        >
            <span className="text-center">Tidak ada acara!</span>

            <div
                className={
                    !inner &&
                    "absolute right-0 bottom-0 h-10 w-10 rounded-full bg-blue-500 blur-2xl"
                }
            ></div>
        </div>
    );
}

export function EventCard({
    id,
    name,
    date,
    timeStart,
    timeEnd,
    location,
    participantsCount,
    partners,
    href,
    snap = false,
    inner = false,
    col = true,
    isMobile,
    tipeEvent
}) {
    const Component = href ? Link : "div";

    return (
        <Component
            href={href}
            key={id}
            className={`flex flex-col ${col && "flex-1"} font-body text-neutral h-full snap-center justify-center gap-6 text-base ${snap && "min-h-42 w-full snap-center"} ${!inner && "border-default/30 rounded-2xl border p-4 lg:p-8"} group relative overflow-hidden`}
        >
            <div className="text-default flex h-full items-center gap-8">
                <div className="rounded-lg bg-blue-50 p-3">
                    <IconDuoAward className="h-8 w-8 shrink-0 text-blue-500" />
                </div>

                <div className="flex w-full min-w-0 flex-col gap-3 lg:gap-5">
                    <span
                        className={`max-w-[10ch] min-w-0 truncate text-base leading-6 font-medium md:max-w-[20ch] lg:text-xl ${isMobile && "max-w-fit text-pretty"}`}
                    >
                        {name}
                    </span>

                    {tipeEvent && (
                        <span className={`w-fit rounded-full px-2 py-0.5 text-xs font-semibold
                                ${tipeEvent === "ONLINE" ? "bg-amber-100 text-amber-700" :
                                tipeEvent === "OFFLINE" ? "bg-lime-100 text-lime-700" :
                                    "bg-blue-100 text-blue-700"}`}
                        >
                            {tipeEvent.charAt(0).toUpperCase() + tipeEvent.slice(1).toLowerCase()}
                        </span>
                    )}

                    <div
                        className={`flex ${col ? "flex-col" : "flex-col sm:flex-row sm:flex-wrap"} gap-3 lg:gap-3`}
                    >
                        <div className="flex items-center gap-1 lg:gap-2">
                            <IconDuoCalendar className="h-5 w-5 shrink-0" />
                            <span className="text-default mt-1 text-sm leading-none lg:mt-0">
                                {formatTanggalSlash(date)}
                            </span>
                        </div>

                        <div className="flex items-center gap-1 lg:gap-2">
                            <IconDuoClock className="h-5 w-5 shrink-0" />
                            <span className="mt-1 text-sm leading-none lg:mt-0">
                                {formatJamMenit(timeStart)} -{" "}
                                {formatJamMenit(timeEnd)}
                            </span>
                        </div>

                        <div className="flex items-center gap-1 lg:gap-2">
                            <IconDuoLocation className="h-5 w-5 shrink-0" />
                            <span className="mt-1 text-sm leading-none lg:mt-0">
                                {location ? location : "Online"}
                            </span>
                        </div>

                        <div className="flex items-center gap-1 lg:gap-2">
                            <div className="flex items-center gap-1 lg:gap-2">
                                <IconDuoUser className="h-5 w-5 shrink-0" />
                                <span className="text-default mt-1 text-sm leading-none lg:mt-0">
                                    {participantsCount ? participantsCount : "0"}{" "}
                                    Peserta
                                </span>
                            </div>

                            {/* 2. Jika ada partner, munculkan Ikon di sisi kanan (ujung) */}
                            {partners && partners.length > 0 && (
                                <div className="text-purple-600/80 mr-2 flex items-center justify-center p-1" title={`${partners.length} Partner Terlibat`}>
                                    <IconDuoHandshake className="h-5 w-5" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={
                    !inner &&
                    "absolute right-0 bottom-0 h-10 w-10 rounded-full bg-blue-500 blur-2xl transition-all duration-500 ease-in-out group-hover:scale-[3.0]"
                }
            ></div>
        </Component>
    );
}
