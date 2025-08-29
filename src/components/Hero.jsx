import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { FaArrowRight } from "react-icons/fa6";


const Hero = () => {
    return (
        <section className="relative bg-gradient-to-br from-blue-50 to-orange-50 py-20 lg:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Transformando vidas, <span className="text-blue-600">construyendo</span>{" "}
                                <span className="text-orange-500">futuros</span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                Promovemos proyectos con enfoque en desarrollo sostenible y tecnológico, orientados hacia la inclusión
                                y el bienestar común.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/noticias">
                                <button size="lg" className="flex items-center py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                                    Conoce más
                                    <FaArrowRight className="ml-2 h-5 w-5" />
                                </button>
                            </Link>
                            <Link href="/programas">
                                <button
                                    size="lg"
                                    variant="outline"
                                    className="border-orange-500 py-2 px-4 rounded-xl text-orange-500 hover:bg-orange-100 bg-transparent"
                                >
                                    Nuestros programas
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-square rounded-2xl bg-[#1B3C8C] overflow-hidden bg-gradient-to-br from-blue-100 to-orange-100">
                            <Image
                                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&quot"
                                alt="Comunidad empoderada por la Fundación Elojim"
                                width={500}
                                height={500}
                                className="w-full h-full object-cover "
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600">2030</div>
                                <div className="text-sm text-gray-600">Nuestra visión</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
