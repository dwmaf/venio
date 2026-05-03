import {
    IconDuoCalendar,
    IconDuoClock,
    IconDuoLocation,
    IconDuoAward,
} from "@/Components/Icons";
import { formatTanggalSlash, formatJamMenit } from "@/utils/format";
import { Link } from "@inertiajs/react";

export function NoEvent({ inner = false }) {
    return (
        <div
            className={`font-heading text-neutral flex min-h-42.5 max-w-screen flex-col items-center justify-center gap-8 text-xl leading-none font-medium md:flex-1 lg:min-h-56 lg:text-2xl ${!inner && "border-default/30 rounded-2xl border p-4 lg:p-8"}`}
        >
            <span>No Event!</span>
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
    href,
    snap = false,
    inner = false,
    col = true,
}) {
    const Component = href ? Link : "div";

    return (
        <Component
            href={href}
            key={id}
            className={`flex flex-col ${col && "flex-1"} font-body text-neutral snap-center justify-between gap-6 text-base ${snap && "min-h-42 min-w-75.75 snap-center lg:min-w-100"} ${!inner && "border-default/30 rounded-2xl border p-4 lg:p-8"}`}
        >
            <div className="text-default flex h-full items-center gap-4">
                <IconDuoAward className="h-8 w-8 shrink-0" />

                <div className="flex flex-col gap-3 lg:gap-5">
                    <span className="text-base leading-6 font-medium text-pretty lg:text-xl">
                        {name}
                    </span>

                    <div className={`flex ${col && "flex-col"} gap-2 lg:gap-4`}>
                        <div className="flex items-center gap-1 lg:gap-2">
                            <IconDuoCalendar className="h-5 w-5 shrink-0 lg:h-6 lg:w-6" />
                            <span className="text-default mt-1 text-sm leading-none lg:mt-0 lg:text-base">
                                {formatTanggalSlash(date)}
                            </span>
                        </div>

                        <div className="flex items-center gap-1 lg:gap-2">
                            <IconDuoClock className="h-5 w-5 shrink-0 lg:h-6 lg:w-6" />
                            <span className="mt-1 text-sm leading-none lg:mt-0 lg:text-base">
                                {formatJamMenit(timeStart)} -{" "}
                                {formatJamMenit(timeEnd)}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 lg:gap-2">
                            <IconDuoLocation className="h-5 w-5 shrink-0 lg:h-6 lg:w-6" />
                            <span className="mt-1 text-sm leading-none lg:mt-0 lg:text-base">
                                {location}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Component>
    );
}
