import React from 'react'

const NavBar = () => {
    return (
        <header className="bg-white shadow-sm ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10  rounded-lg flex items-center justify-center">
                            {/* <img  className="text-white font-bold text-lg">E</img> */}
                            <img src="./logo2.webp" className='object-scale-down w-32 h-32 mx-4' alt="" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Fundación Elojim</h1>
                            <p className="text-xs text-gray-600">Jadach</p>
                        </div>
                    </div>

                    <nav className="hidden md:flex space-x-8">
                        <a href="#inicio" className="text-gray-700 hover:text-blue-600 font-medium">
                            Inicio
                        </a>
                        <a href="#nosotros" className="text-gray-700 hover:text-blue-600 font-medium">
                            Nosotros
                        </a>
                        <a href="#programas" className="text-gray-700 hover:text-blue-600 font-medium">
                            Programas
                        </a>
                        <a href="#noticias" className="text-gray-700 hover:text-blue-600 font-medium">
                            Noticias
                        </a>
                        <a href="#contacto" className="text-gray-700 hover:text-blue-600 font-medium">
                            Contáctanos
                        </a>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default NavBar
