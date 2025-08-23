import Image from 'next/image'
import React from 'react'
import { FaArrowRight } from 'react-icons/fa6'

const News = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Últimas Noticias</h2>
                    <p className="text-xl text-gray-600">
                        Mantente informado sobre nuestros proyectos, eventos y el impacto que generamos en la comunidad
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="group border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                            <div className="aspect-video bg-gradient-to-br from-blue-100 to-orange-100 rounded-t-lg overflow-hidden">
                                <Image
                                    src={'/./logo.webp'}
                                    alt={`Noticia ${item}`}
                                    width={300}
                                    height={200}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-6">
                                <div className="text-sm text-blue-600 font-medium mb-2">
                                    {item === 1 ? "Empoderamiento" : item === 2 ? "Tecnología" : "Sostenibilidad"}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {item === 1
                                        ? "Nuevo programa de capacitación para mujeres emprendedoras"
                                        : item === 2
                                            ? "Implementación de tecnología en agricultura urbana"
                                            : "Proyecto de seguridad alimentaria en comunidades rurales"}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Conoce más sobre nuestros últimos proyectos y el impacto positivo que estamos generando...
                                </p>
                                <button variant="ghost" className= "flex items-center gap-2 py-2 px-4 text-blue-600 hover:text-blue-700 p-0">
                                    Leer más <FaArrowRight className=" h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default News
