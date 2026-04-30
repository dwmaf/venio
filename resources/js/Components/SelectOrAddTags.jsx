import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";

export default function SelectOrAddTags({
    selectedTags,
    onChange,
    placeholder = "Ketik lalu enter...",
    apiEndpoint = "/api/partners/search",
}) {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    // Menutup dropdown jika klik di luar komponen
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Memanggil API saat user mengetik
    const handleInputChange = async (e) => {
        const val = e.target.value;
        setInputValue(val);

        if (val.trim().length > 1) {
            // Hit API jika > 1 karakter
            try {
                // Pastikan Anda sudah membuat Route dan logic API-nya ya
                const response = await axios.get(`${apiEndpoint}?q=${val}`);
                setSuggestions(response.data);
                setShowSuggestions(true);
            } catch (error) {
                console.error("Gagal mengambil saran:", error);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const addTag = (tagName) => {
        const cleanTag = tagName.trim();
        // Cek jika tidak kosong dan belum ada di array
        if (cleanTag && !selectedTags.includes(cleanTag)) {
            onChange([...selectedTags, cleanTag]);
        }
        setInputValue("");
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag(inputValue);
        }
    };

    const removeTag = (tagToRemove) => {
        onChange(selectedTags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            {/* Box Input & Tags */}
            <div className="flex flex-wrap items-center gap-2 w-full border border-default/30 rounded-lg p-3 min-h-12.5 bg-white">
                {/* Render Chips (Tag Terpilih) */}
                {selectedTags.map((tag, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-1 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                        <span>{tag}</span>
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-500 rounded-full"
                        >
                            <Icon icon="carbon:close" />
                        </button>
                    </div>
                ))}

                {/* Actual Input Field */}
                <input
                    type="text"
                    className="flex-1 outline-none text-sm lg:text-base placeholder:text-neutral bg-transparent min-w-30"
                    placeholder={
                        selectedTags.length === 0
                            ? placeholder
                            : "Tambah lagi..."
                    }
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (suggestions.length > 0) setShowSuggestions(true);
                    }}
                />
            </div>

            {/* Dropdown Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-default/30 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="px-4 py-2 hover:bg-neutral-100 cursor-pointer text-[16px]"
                            onClick={() => addTag(suggestion)}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
