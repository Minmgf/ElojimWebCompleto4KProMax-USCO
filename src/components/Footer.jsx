import React from 'react'
import { FaFacebook, FaInstagramSquare } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10  rounded-lg flex items-center justify-center">
                                <img src="./logo2.webp" className='object-scale-down w-32 h-32 mx-4' alt="" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Fundación Elojim Jadach</h3>
                            </div>
                        </div>
                        <p className="text-gray-400">
                            Transformando vidas, construyendo futuros más brillantes para nuestra comunidad.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    Inicio
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    Nosotros
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    Programas
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    Contacto
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    Términos y Condiciones
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    Política de Privacidad
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    Aviso Legal
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Síguenos</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaFacebook  className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaXTwitter  className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaInstagramSquare  className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                    <p>© 2025 Fundación Elojim Jadach. Todos los derechos reservados. NIT: 901714461-5</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
