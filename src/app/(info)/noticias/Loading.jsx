import React from 'react';

const Loading = () => {
    return (
        <div className="w-full h-[280px] bg-gray-200 animate-pulse rounded-lg shadow-md flex flex-col overflow-hidden">
            {/* Imagen del Skeleton */}
            <div className="w-full h-[70%] bg-gray-300"></div>

            {/* Contenedor de Texto */}
            <div className="p-4 flex flex-col gap-2">
                <div className="w-3/4 h-5 bg-gray-400 rounded"></div> {/* Título */}
                <div className="w-full h-4 bg-gray-300 rounded"></div> {/* Descripción corta */}
                <div className="w-2/3 h-3 bg-gray-300 rounded"></div> {/* Línea adicional */}
            </div>
        </div>
    );
};

export default Loading;
