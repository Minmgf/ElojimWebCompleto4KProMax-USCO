import React from 'react'

const MisionVision = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16">
                    <div className="border-l-4 border-l-blue-600 shadow-lg rounded-xl">
                        <div className="p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Misión</h2>
                            <p className="text-gray-600 leading-relaxed">
                                La fundación Elojim Jadach fundamentada en la promoción de proyectos con un enfoque en desarrollo
                                sostenible y tecnológico, orientados hacia la inclusión y el bienestar común. Su meta es generar un
                                cambio duradero en la sociedad con modelos de madurez tecnológica trabajando en colaboración con
                                modelos de investigación, emprendimiento e innovación.
                            </p>
                        </div>
                    </div>

                    <div className="border-l-4 border-l-orange-500 shadow-lg rounded-xl">
                        <div className="p-8 ">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Visión</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Nuestra visión va dirigida a un mundo donde todas las personas tengan la oportunidad de alcanzar su
                                máximo potencial y vivir vidas dignas y plenas. Visualizamos en el 2030 una sociedad donde la igualdad
                                de oportunidades, el respeto por la diversidad y la solidaridad son los pilares fundamentales.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MisionVision
