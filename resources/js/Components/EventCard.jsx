import { Icon } from "@iconify/react";
import { formatTanggalSlash, formatJamMenit } from "@/utils/format";

export function NoEvent() {
    return (
        <div className="min-h-42.5 lg:min-h-56 flex flex-col items-center justify-center md:flex-1 border border-default/30 rounded-2xl p-4 lg:p-8 gap-8 font-heading text-neutral font-medium text-xl lg:text-2xl leading-none">
            <span>No Event!</span>
        </div>
    );
}

export function EventCard({ id, name, date, timeStart, timeEnd, location }) {
    return (
        <div
            key={id}
            className="flex flex-col flex-1 snap-center justify-between border border-default/30 rounded-2xl p-4 lg:p-8 gap-6 font-body text-neutral text-base"
        >
            <div className="h-full flex gap-4 items-center text-default">
                <Icon icon="duo-icons:award" width="40" height="40" />
                <div className="flex flex-col gap-3 lg:gap-5">
                    <span className="font-medium text-base lg:text-xl leading-6 text-black text-pretty">
                        {name}
                    </span>
                    <div className="flex flex-col gap-2 lg:gap-4">
                        <div className="flex gap-1 lg:gap-2 items-center">
                            <Icon
                                icon="duo-icons:calendar"
                                className="w-5 h-5 lg:w-6 lg:h-6"
                            />
                            <span className="leading-none text-sm lg:text-base mt-1 lg:mt-0">
                                {formatTanggalSlash(date)}
                            </span>
                        </div>
                        <div className="flex gap-1 lg:gap-2 items-center">
                            <Icon
                                icon="duo-icons:clock"
                                className="w-5 h-5 lg:w-6 lg:h-6"
                            />
                            <span className="leading-none text-sm lg:text-base mt-1 lg:mt-0">
                                {formatJamMenit(timeStart)} -{" "}
                                {formatJamMenit(timeEnd)}
                            </span>
                        </div>
                        <div className="flex gap-1 lg:gap-2 items-center">
                            <Icon
                                icon="duo-icons:location"
                                className="w-5 h-5 lg:w-6 lg:h-6"
                            />
                            <span className="leading-none text-sm lg:text-base mt-1 lg:mt-0">
                                {location}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
