import {
    IconDuoCalendar,
    IconDuoClock,
    IconDuoLocation,
    IconDuoAward,
    IconDuoUser,
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
    href,
    snap = false,
    inner = false,
    col = true,
    isMobile,
}) {
    const Component = href ? Link : "div";

    return (
        <Component
            href={href}
            key={id}
            className={`flex flex-col ${col && "flex-1"} font-body text-neutral h-full snap-center justify-center gap-6 text-base ${snap && "min-h-42 w-full snap-center"} ${!inner && "border-default/30 rounded-2xl border p-4 lg:p-8"} relative overflow-hidden`}
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
                            <IconDuoUser className="h-5 w-5 shrink-0" />
                            <span className="text-default mt-1 text-sm leading-none lg:mt-0">
                                {participantsCount ? participantsCount : "0"}{" "}
                                Peserta
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={
                    !inner &&
                    "absolute right-0 bottom-0 h-10 w-10 rounded-full bg-blue-500 blur-2xl"
                }
            ></div>
        </Component>
    );
}
