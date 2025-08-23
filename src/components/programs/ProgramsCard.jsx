import React from 'react'

export function ProgramsCard({
    title,
    description,
    icon: Icon,
    color,
    iconColor,
    titleColor
}) {
    return (
        <div
            className={`p-6 border rounded-2xl shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-md ${color}`}
        >
            <div className="flex items-center mb-4">
                <div
                    className={`p-3 rounded-full bg-white shadow-md mr-4 flex items-center justify-center ${iconColor}`}
                >
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <h2 className={`text-xl font-semibold ${titleColor}`}>{title}</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
    )
}
