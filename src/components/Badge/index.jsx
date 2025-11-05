import React from "react";
import clsx from "clsx";

const Badge = ({ title, color = "default" }) => {
    const colorClasses = {
        default: "bg-gray-800 text-white border border-gray-600",
        success: "bg-green-800 text-white border border-green-600/40",
        danger: "bg-red-800 text-white border border-red-600/40",
        warning: "bg-yellow-800 text-white border border-yellow-600/40",
        info: "bg-blue-800 text-white border border-blue-600/40",
        purple: "bg-purple-800 text-white border border-purple-600/40",
        pink: "bg-pink-800 text-white border border-pink-600/40",
    };

    return (
        <span
            className={clsx(
                "px-3 py-1 text-sm font-medium rounded-full transition-all duration-200",
                colorClasses[color] || colorClasses.default
            )}
        >
            {title}
        </span>
    );
};

export default Badge;