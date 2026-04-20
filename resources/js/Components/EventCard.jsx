import { Icon } from "@iconify/react";
import { formatTanggalSlash, formatJamMenit } from "@/utils/format";

export function NoEvent() {
    return (
        <div className="min-h-full flex flex-col flex-1 border border-default/30 rounded-2xl p-8 gap-8 font-heading text-neutral font-medium text-2xl leading-none">
            <div className="flex gap-4 items-center justify-center h-full">
                <span>No Event!</span>
            </div>
        </div>
    );
}

export function EventCard({ id, name, date, timeStart, timeEnd, location }) {
    return (
        <div
            key={id}
            className="h-full flex flex-col flex-1 snap-center justify-between border border-default/30 rounded-2xl p-8 gap-6 font-body text-neutral text-base"
        >
            <div className="flex gap-4 items-center text-default">
                <Icon icon="duo-icons:award" width="40" height="40" />
                <div className="flex flex-col gap-5">
                    <span className="font-medium text-xl leading-none text-black">
                        {name}
                    </span>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2 items-center">
                            <Icon
                                icon="duo-icons:calendar"
                                width="24"
                                height="24"
                            />
                            <span className="leading-none">
                                {formatTanggalSlash(date)}
                            </span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Icon
                                icon="duo-icons:clock"
                                width="24"
                                height="24"
                            />
                            <span className="leading-none">
                                {formatJamMenit(timeStart)} -{" "}
                                {formatJamMenit(timeEnd)}
                            </span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Icon
                                icon="duo-icons:location"
                                width="24"
                                height="24"
                            />
                            <span className="leading-none">{location}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
