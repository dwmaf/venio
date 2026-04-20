import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";

export function RouteButton({ text }) {
    return (
        <Link
            href={route("ongoing.events")}
            className="flex gap-2 items-center font-body font-medium text-blue-700 text-lg leading-none hover:underline"
        >
            <span>{text}</span>
            <Icon
                icon="basil:arrow-left-outline"
                width="24"
                height="24"
                rotate={2}
                className="text-blue-700"
            />
        </Link>
    );
}
