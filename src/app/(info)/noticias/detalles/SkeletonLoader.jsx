import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6 pt-24 animate-pulse">
      <div className="max-w-3xl mx-auto">
        {/* Categorías */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="px-8 py-2 bg-gray-300 rounded-full w-24 h-6"></div>
          ))}
        </div>

        {/* Título */}
        <div className="h-10 md:h-16 bg-gray-300 rounded mb-6 w-3/4"></div>

        {/* Autor y fecha */}
        <div className="flex flex-wrap items-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            <div className="h-6 bg-gray-300 rounded w-24"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            <div className="h-6 bg-gray-300 rounded w-32"></div>
          </div>
        </div>

        {/* Carrusel */}
        <div className="mb-5">
          <div className="w-full h-64 bg-gray-300 rounded-lg"></div>
        </div>

        {/* Contenido */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-full h-4 bg-gray-300 rounded my-3"></div>
          ))}
        </div>

        {/* Autor */}
        <div className="mt-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl p-6 shadow-md flex items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gray-300"></div>
          </div>
          <div className="flex-1">
            <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-40 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;