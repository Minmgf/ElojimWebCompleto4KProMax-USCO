"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import ProgramsCard from "@/components/ProgramsCard";
import ProgramModal from "@/components/ProgramModal";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔹 Obtener programas desde la API
  useEffect(() => {
    async function fetchPrograms() {
      try {
        setLoading(true);
        const res = await fetch("/api/programas/gestion-programas");
        if (!res.ok) throw new Error("Error fetching programs");
        const data = await res.json();
        console.log("Programas cargados:", data);
        setPrograms(data);
      } catch (err) {
        console.error("Error cargando programas:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrograms();
  }, []);

  // 🔹 Filtrar por búsqueda
  const filteredPrograms = programs.filter((program) =>
    program.name?.toLowerCase().includes(query.toLowerCase())
  );

  // 🔹 Abrir modal con programa específico
  const handleOpenModal = (program) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  // 🔹 Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProgram(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6 pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando programas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-6 pt-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-800 mb-6">
          Nuestros programas sociales
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto mb-10 leading-relaxed">
          Explora nuestros programas sociales y únete a las iniciativas que están transformando vidas en nuestra comunidad.
        </p>

        {/* 🔍 Buscador */}
        <div className="flex items-center max-w-lg mx-auto px-6 py-3 bg-white rounded-2xl border-2 shadow-lg border-gray-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-200 transition-all duration-300">
          <div className="flex items-center justify-center w-12 h-12">
            <Search className="text-gray-500 h-6 w-6" />
          </div>
          <input
            type="text"
            placeholder="Buscar programas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="ml-4 flex-1 bg-transparent border-none outline-none text-lg text-gray-700 placeholder-gray-400 focus:ring-0"
          />
        </div>
      </div>

      {/* 🔹 Grid de programas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {filteredPrograms.length > 0 ? (
          filteredPrograms.map((program) => (
            <div key={program.id} onClick={() => handleOpenModal(program)} className="cursor-pointer group">
              <ProgramsCard
                title={program.name}
                description={program.description}
                requirements={program.requirements}
                benefits={program.benefits}
                specificInformation={program.specificInformation}
                programId={program.id}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <div className="bg-white rounded-3xl p-12 max-w-lg mx-auto shadow-lg border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">
                {query ? "No se encontraron resultados" : "No hay programas disponibles"}
              </h3>
              <p className="text-gray-500 text-lg leading-relaxed">
                {query 
                  ? `No se encontraron programas que coincidan con "${query}"`
                  : "Por el momento no hay programas disponibles para mostrar."
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 🔹 Modal del programa */}
      {isModalOpen && selectedProgram && (
        <ProgramModal
          program={selectedProgram}
          onClose={handleCloseModal}
          isOpen={isModalOpen}
        />
      )}
    </div>
  );
}