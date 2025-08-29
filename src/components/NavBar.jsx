"use client"

import Link from 'next/link'
import React, { useState } from 'react'

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-white fixed top-0 w-full z-50 shadow-sm border-b border-gray-200 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href={'/'} className="flex items-center space-x-3">
                        <div className="w-10 h-10  rounded-lg flex items-center justify-center">
                            <img src="./logo2.webp" className='object-scale-down w-32 h-32 mx-4' alt="" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Fundación Elojim</h1>
                            <p className="text-xs text-gray-600">Jadach</p>
                        </div>
                    </Link>

                    <nav className="hidden md:flex space-x-8">
                        <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                            Inicio
                        </a>
                        <a href="/#nosotros" className="text-gray-700 hover:text-blue-600 font-medium">
                            Nosotros
                        </a>
                        <Link href="/programas" className="text-gray-700 hover:text-blue-600 font-medium">
                            Programas
                        </Link>
                        <a href="/noticias" className="text-gray-700 hover:text-blue-600 font-medium">
                            Noticias
                        </a>
                        <a href="/#contacto" className="text-gray-700 hover:text-blue-600 font-medium">
                            Contáctanos
                        </a>
                    </nav>

                    {/* Botón hamburguesa para móvil */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 focus:outline-none"
                        aria-label="Abrir menú"
                    >
                        <span 
                            className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ease-in-out ${
                                isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                            }`}
                        ></span>
                        <span 
                            className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ease-in-out ${
                                isMenuOpen ? 'opacity-0' : ''
                            }`}
                        ></span>
                        <span 
                            className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ease-in-out ${
                                isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                            }`}
                        ></span>
                    </button>
                </div>

                {/* Menú móvil */}
                <div className={`md:hidden transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}>
                    <nav className="px-4 pt-2 pb-4 space-y-2 bg-white border-t border-gray-200">
                        <a 
                            href="/" 
                            className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                            onClick={closeMenu}
                        >
                            Inicio
                        </a>
                        <a 
                            href="/#nosotros" 
                            className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                            onClick={closeMenu}
                        >
                            Nosotros
                        </a>
                        <Link 
                            href="/programas" 
                            className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                            onClick={closeMenu}
                        >
                            Programas
                        </Link>
                        <a 
                            href="/noticias" 
                            className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                            onClick={closeMenu}
                        >
                            Noticias
                        </a>
                        <a 
                            href="/#contacto" 
                            className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                            onClick={closeMenu}
                        >
                            Contáctanos
                        </a>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default NavBar
