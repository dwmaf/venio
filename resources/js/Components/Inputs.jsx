import { Icon } from "@iconify/react";
import { useState } from "react";

export function TextInput({
    htmlFor,
    id,
    name,
    placeholder,
    value,
    onChange,
    text,
    errors,
}) {
    return (
        <div className="flex flex-col gap-2">
            <label
                htmlFor={htmlFor}
                className="text-sm lg:text-base font-medium"
            >
                {text}
            </label>
            <input
                id={id}
                name={name}
                placeholder={placeholder}
                type="text"
                value={value}
                onChange={onChange}
                autoFocus
                required
                className="border border-default/30 placeholder:text-neutral font-body p-3 text-sm w-full focus:border-blue-500 focus:outline-blue-500 rounded-lg"
            />
        </div>
    );
}

export function PasswordInput({
    htmlFor,
    id,
    name,
    value,
    placeholder,
    onClick,
    onChange,
    text,
    errors,
}) {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="flex flex-col gap-2">
            <label
                htmlFor={htmlFor}
                className="text-sm lg:text-base font-medium"
            >
                {text}
            </label>
            <div className="relative flex items-center justify-between">
                <input
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    required
                    className="border border-default/30 placeholder:text-neutral font-body p-3 text-sm w-full focus:border-blue-500 focus:outline-blue-500 rounded-lg"
                />

                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral cursor-pointer"
                    tabIndex={-1}
                >
                    {showPassword ? (
                        <Icon icon="iconoir:eye-closed" className="w-5 h-5" />
                    ) : (
                        <Icon icon="iconoir:eye-solid" className="w-5 h-5" />
                    )}
                </button>
            </div>
        </div>
    );
}

export function Checkbox({ name, checked, onChange }) {
    console.log(checked);
    return (
        <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            className="w-4 h-4 mt-0.5 aspect-square rounded checked:bg-blue-500 checked:border-blue-500 focus:ring-blue-500 cursor-pointer text-blue-500 accent-blue-500"
        />
    );
}

export function SearchInput({
    id,
    name,
    placeholder = "Cari...",
    value,
    onChange,
}) {
    return (
        <div className="relative flex items-center w-full mt-1">
            {/* Menambahkan Ikon Kaca Pembesar (opsional tapi bagus untuk visual) */}
            <Icon
                icon="lets-icons:search-alt"
                className="absolute left-4 w-5 h-5 text-neutral"
            />
            <input
                id={id}
                name={name}
                placeholder={placeholder}
                type="text"
                value={value}
                onChange={onChange}
                // Bebas dari autoFocus dan required
                className="border border-default/30 placeholder:text-neutral font-body py-3 pl-11 pr-4 text-sm w-full focus:border-blue-500 focus:outline-blue-500 rounded-lg"
            />
        </div>
    );
}