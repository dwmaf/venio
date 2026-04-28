export function TableHead({ text }) {
    return (
        <th className="p-2 lg:p-5 font-medium font-body text-base lg:text-xl leading-none">
            {text}
        </th>
    );
}

export function TableRow({ key, children }) {
    return (
        <tr key={key} className="border-b border-neutral-400">
            {children}
        </tr>
    );
}

export function TableData({ text }) {
    return (
        <td className="p-5 font-body text-base leading-none whitespace-nowrap">
            {text}
        </td>
    );
}
