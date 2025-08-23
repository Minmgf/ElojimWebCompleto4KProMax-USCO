import React from 'react'
import { FaUsers, FaLightbulb, FaLeaf, FaHeart    } from "react-icons/fa";


const ImpactAreas = () => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestras Áreas de Impacto</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Trabajamos en múltiples frentes para crear un impacto positivo y duradero en nuestra comunidad
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8  ">
                    <div className="group hover:shadow-xl  transition-all border border-gray-200 rounded-xl duration-300 hover:-translate-y-2">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500 transition-colors">
                                <FaUsers  className="h-8 w-8 text-orange-500 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Empoderamiento de la Mujer</h3>
                            <p className="text-gray-600">
                                Brindamos apoyo a mujeres en situación de vulnerabilidad a través de programas de capacitación,
                                emprendimiento y asistencia social.
                            </p>
                        </div>
                    </div>

                    <div className="group hover:shadow-xl transition-all border border-gray-200 rounded-xl duration-300 hover:-translate-y-2">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                                <FaLightbulb  className="h-8 w-8 text-blue-600 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Innovación y Tecnología Aplicada</h3>
                            <p className="text-gray-600">
                                Incorporamos soluciones tecnológicas en el sector agropecuario y social para optimizar procesos
                                productivos y mejorar la calidad de vida.
                            </p>
                        </div>
                    </div>

                    <div className="group hover:shadow-xl transition-all border border-gray-200 rounded-xl duration-300 hover:-translate-y-2">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600 transition-colors">
                                <FaLeaf  className="h-8 w-8 text-green-600 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Seguridad Alimentaria y Agricultura Sostenible</h3>
                            <p className="text-gray-600">
                                Promovemos la producción agrícola inteligente y la agricultura urbana para garantizar el acceso a
                                alimentos saludables y sostenibles.
                            </p>
                        </div>
                    </div>

                    <div className="group hover:shadow-xl transition-all border border-gray-200 rounded-xl duration-300 hover:-translate-y-2">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-600 transition-colors">
                                <FaHeart  className="h-8 w-8 text-purple-600 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Inclusión Social y Diversidad</h3>
                            <p className="text-gray-600">
                                Impulsamos espacios de respeto y equidad para poblaciones vulnerables, garantizando su integración y
                                participación en la sociedad.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ImpactAreas
