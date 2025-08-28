import Link from 'next/link'
import React from 'react'

const NavBar = () => {
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
                </div>
            </div>
        </header>
    )
}

export default NavBar
