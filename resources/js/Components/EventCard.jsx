import { IconDuoCalendar, IconDuoClock, IconDuoLocation, IconDuoAward } from "@/Components/Icons";
import { formatTanggalSlash, formatJamMenit } from "@/utils/format";
import { Link } from "@inertiajs/react";

export function NoEvent({ inner = false }) {
    return (
        <div
            className={`min-h-42.5 max-w-screen lg:min-h-56 flex flex-col items-center justify-center md:flex-1 gap-8 font-heading text-neutral font-medium text-xl lg:text-2xl leading-none ${!inner && "border border-default/30 rounded-2xl p-4 lg:p-8"}`}
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
    col = false,
}) {
    const Component = href ? Link : "div";

    return (
        <Component
            href={href}
            key={id}
            className={`flex flex-col ${col && "flex-1"} snap-center justify-between gap-6 font-body text-neutral text-base ${snap && "snap-center min-w-75.75 lg:min-w-100 min-h-42"} ${!inner && "border border-default/30 rounded-2xl p-4 lg:p-8"}`}
        >
            <div className="h-full flex gap-4 items-center text-default">
                <IconDuoAward className="w-8 h-8 lg:w-6 lg:h-6 shrink-0"/>

                <div className="flex flex-col gap-3 lg:gap-5">
                    <span className="font-medium text-base lg:text-xl leading-6 text-pretty">
                        {name}
                    </span>

                    <div className={`flex ${col && "flex-col"} gap-2 lg:gap-4`}>
                        <div className="flex gap-1 lg:gap-2 items-center">
                            <IconDuoCalendar className="w-5 h-5 lg:w-6 lg:h-6 shrink-0" />
                            <span className="leading-none text-sm lg:text-base mt-1 lg:mt-0 text-default">
                                {formatTanggalSlash(date)}
                            </span>
                        </div>

                        <div className="flex gap-1 lg:gap-2 items-center">
                            <IconDuoClock className="w-5 h-5 lg:w-6 lg:h-6 shrink-0"/>
                            <span className="leading-none text-sm lg:text-base mt-1 lg:mt-0">
                                {formatJamMenit(timeStart)} -{" "}
                                {formatJamMenit(timeEnd)}
                            </span>
                        </div>
                        <div className="flex gap-1 lg:gap-2 items-center">
                            <IconDuoLocation className="w-5 h-5 lg:w-6 lg:h-6 shrink-0" />
                            <span className="leading-none text-sm lg:text-base mt-1 lg:mt-0">
                                {location}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Component>
    );
}
