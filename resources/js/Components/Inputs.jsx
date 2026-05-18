import { IconoirEyeClosed, IconoirEyeSolid, IconLetsSearchAlt, IconChevronDown } from "@/Components/Icons";
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
                        <IconoirEyeClosed className="w-5 h-5"/>
                    ) : (
                        <IconoirEyeSolid className="w-5 h-5" />
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
            <IconLetsSearchAlt className="absolute left-4 w-5 h-5 text-neutral" />
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

export function InputWithIcon({ label, type = "text", value, onChange, placeholder, icon: IconComponent, error, required = false, ...props }) {
    return (
        <div className="space-y-2">
            <label className="block text-base lg:text-xl leading-none">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className="relative flex items-center">
                <div className="absolute left-4 text-neutral pointer-events-none">
                    <IconComponent className="w-5 h-5" />
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className="border border-default/30 placeholder:text-neutral font-body p-3 pl-11 text-sm lg:text-base w-full focus:border-blue-500 focus:outline-blue-500 rounded-lg"
                    {...props}
                />
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

export function SelectInput({ label, value, onChange, options = [], error, required = false, ...props }) {
    return (
        <div className="space-y-2">
            <label className="block text-base lg:text-xl leading-none">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className="relative flex items-center">
                <select
                    className="appearance-none border border-default/30 placeholder:text-neutral font-body p-3 text-sm lg:text-base w-full focus:border-blue-500 focus:outline-blue-500 rounded-lg cursor-pointer"
                    value={value}
                    onChange={onChange}
                    required={required}
                    {...props}
                >
                    {options.map((opt, idx) => (
                        <option key={idx} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute right-4 text-neutral">
                    <IconChevronDown className="h-4 w-4" />
                </div>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

export function FormInput({ label, type = "text", value, onChange, placeholder, error, required = false, ...props }) {
    return (
        <div className="space-y-2">
            <label className="block text-base lg:text-xl leading-none">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="border border-default/30 placeholder:text-neutral font-body p-3 text-sm lg:text-base w-full focus:border-blue-500 focus:outline-blue-500 rounded-lg"
                {...props}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}