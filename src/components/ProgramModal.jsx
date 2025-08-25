"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import ProgramsCard from "@/components/ProgramsCard"; // tu tarjeta de programas

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [query, setQuery] = useState("");

  // 🔹 Obtener programas desde la API
  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await fetch("/api/programas/gestion-programas");
        if (!res.ok) throw new Error("Error fetching programs");
        const data = await res.json();
        console.log(data)
        setPrograms(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchPrograms();
  }, []);

  // 🔹 Filtrar por búsqueda
  const filteredPrograms = programs.filter((program) =>
    program.name?.toLowerCase().includes(query.toLowerCase()) // 👈 ajusta al campo real
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 pt-24">
      <div className="text-center mb-12">
        <h1 className="text-lg md:text-5xl font-bold text-blue-800 mb-4">
          Nuestros programas sociales
        </h1>
        <p className="text-md text-gray-600 max-w-3xl mx-auto mb-8">
          Explora nuestros programas sociales y únete a las iniciativas que están transformando vidas en nuestra comunidad.
        </p>

        {/* 🔍 Buscador */}
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

      {/* 🔹 Grid de programas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {filteredPrograms.length > 0 ? (
          filteredPrograms.map((program) => (
            <ProgramsCard
              key={program.id}
              title={program.name} // 👈 ajusta al schema
              description={program.description}
              requirements={program.requirements}
              benefits={program.benefits}
              specificInformation={program.specificInformation}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 text-lg">
            No se encontraron programas
          </p>
        )}
      </div>
    </div>
  );
}
