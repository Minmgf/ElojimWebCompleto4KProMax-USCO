"use client";

import React, { useState } from 'react'
import { Search, Heart, Lightbulb, Wrench, Leaf, GraduationCap, Code, Users, Music, DollarSign } from "lucide-react"
import { ProgramsCard } from '@/components/programs/ProgramsCard'

const programs = [
    {
        id: 1,
        title: "Programa Mujer Vulnerable",
        description:
            "Apoyo integral a mujeres en situación de vulnerabilidad a través de asistencia psicológica, legal y formación para el empleo.",
        icon: Heart,
        color: "bg-pink-100 border-pink-200 hover:bg-pink-50",
        iconColor: "text-pink-600",
        titleColor: "text-pink-700",
    },
    {
        id: 2,
        title: "Semillero de Innovación y Emprendimiento",
        description:
            "Formación y acompañamiento para el desarrollo de proyectos innovadores con impacto social y económico.",
        icon: Lightbulb,
        color: "bg-green-100 border-green-200 hover:bg-green-50",
        iconColor: "text-green-600",
        titleColor: "text-green-700",
    },
    {
        id: 3,
        title: "Programa Taller STEAM+H",
        description:
            "Formación en ciencia, tecnología, ingeniería, arte, matemáticas y humanidades para niños, niñas y adolescentes.",
        icon: Wrench,
        color: "bg-orange-100 border-orange-200 hover:bg-orange-50",
        iconColor: "text-orange-600",
        titleColor: "text-orange-700",
    },
    {
        id: 4,
        title: "Programa de Seguridad Alimentaria",
        description:
            "Implementación de sistemas agrícolas sostenibles para mejorar la producción, distribución y acceso a alimentos nutritivos.",
        icon: Leaf,
        color: "bg-teal-100 border-teal-200 hover:bg-teal-50",
        iconColor: "text-teal-600",
        titleColor: "text-teal-700",
    },
    {
        id: 5,
        title: "Programa de Jornadas de Refuerzo Escolar",
        description:
            "Apoyo académico para niños, niñas y adolescentes con dificultades en su proceso de aprendizaje escolar.",
        icon: GraduationCap,
        color: "bg-yellow-100 border-yellow-200 hover:bg-yellow-50",
        iconColor: "text-yellow-600",
        titleColor: "text-yellow-700",
    },
    {
        id: 6,
        title: "Programa de Factoría de Software",
        description:
            "Formación en desarrollo de software y creación de soluciones tecnológicas para problemas comunitarios.",
        icon: Code,
        color: "bg-blue-100 border-blue-200 hover:bg-blue-50",
        iconColor: "text-blue-600",
        titleColor: "text-blue-700",
    },
    {
        id: 7,
        title: "Programa de Voluntariado Social",
        description:
            "Oportunidades para contribuir con tiempo y talento en proyectos sociales de alto impacto comunitario.",
        icon: Users,
        color: "bg-red-100 border-red-200 hover:bg-red-50",
        iconColor: "text-red-600",
        titleColor: "text-red-700",
    },
    {
        id: 8,
        title: "Programa Cultural",
        description:
            "Formación en música, danza, manualidades y otras expresiones artísticas para el desarrollo integral de la comunidad.",
        icon: Music,
        color: "bg-purple-100 border-purple-200 hover:bg-purple-50",
        iconColor: "text-purple-600",
        titleColor: "text-purple-700",
    },
    {
        id: 9,
        title: "Programa Economía Plateada",
        description: "Apoyo integral para adultos mayores en el desarrollo de proyectos sociales y bienestar comunitario.",
        icon: DollarSign,
        color: "bg-gray-100 border-gray-200 hover:bg-gray-50",
        iconColor: "text-gray-600",
        titleColor: "text-gray-700",
    },
]

export default function page() {

    const [query, setQuery] = useState("");

    const filteredPrograms = programs.filter((program) =>
        program.title.toLowerCase().includes(query.toLowerCase())
    );
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6 pt-24">
            <div className="text-center mb-12">
                <h1 className="text-lg md:text-5xl font-bold text-blue-800 mb-4">Nuestros programas sociales</h1>
                <p className="text-md text-gray-600 max-w-3xl mx-auto mb-8">
                    Explora nuestros programas sociales y únete a las iniciativas que están transformando vidas en nuestra
                    comunidad.
                </p>

                <div className="flex items-center max-w-md mx-auto px-4 py-1 bg-white rounded-xl border shadow-sm border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-300">
                    <div className="flex items-center justify-center w-10 h-10">
                        <Search className="text-gray-500 h-5 w-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar programas..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="ml-3 flex-1 bg-transparent border-none outline-none text-base text-gray-700 placeholder-gray-400 focus:ring-0"
                    />
                </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {filteredPrograms.length > 0 ? (
                    filteredPrograms.map((program) => (
                        <ProgramsCard key={program.id} {...program} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500 text-lg">
                        No se encontraron programas
                    </p>
                )}
            </div>
        </div>
    )
}
