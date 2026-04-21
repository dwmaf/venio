import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";

export function RouteButton({ text }) {
    return (
        <Link
            href={route("ongoing.events")}
            className="flex gap-0.5 lg:gap-2 items-center font-body font-medium text-blue-700 text-sm lg:text-lg leading-none hover:underline"
        >
            <span>{text}</span>
            <Icon
                icon="basil:arrow-left-outline"
                rotate={2}
                className="text-blue-700 w-5 h-5 lg:w-6 lg:h-6 aspect-square"
            />
        </Link>
    );
}
