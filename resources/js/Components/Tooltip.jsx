export default function Tooltip({ text }) {
    return (
        <span className="absolute font-body border border-default/30 p-1 left-16 text-xs bg-bg rounded-sm text-nowrap invisible opacity-0 scale-95 transition-all group-hover:visible group-hover:opacity-100 group-hover:scale-100">
            {text}
        </span>
    );
}
