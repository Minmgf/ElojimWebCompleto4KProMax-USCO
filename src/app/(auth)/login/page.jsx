import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 h-screen">
            <div className="w-full max-w-md  ">
                <div className="shadow-xl border-0 p-8 rounded-xl ">
                    <div className="text-center pb-8">
                        <div className="text-3xl font-bold text-gray-900">Iniciar Sesión</div>
                        <p className="text-gray-600 mt-2">Accede a tu cuenta de la fundación</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2 flex flex-col gap-2">
                            <label htmlFor="email" className="text-gray-700 font-medium">
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="tu@email.com"
                                className="h-12 border-gray-300 border rounded-lg p-2 focus:border-blue-600 focus:ring-blue-600"
                            />
                        </div>

                        <div className="space-y-2 flex flex-col gap-2">
                            <label htmlFor="password" className="text-gray-700 font-medium">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="h-12 border-gray-300 border rounded-lg p-2 focus:border-blue-600 focus:ring-blue-600"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                                />
                                <label htmlFor="remember" className="text-sm text-gray-600">
                                    Recordarme
                                </label>
                            </div>
                            <Link href="#" className="text-sm  text-blue-600 hover:text-blue-700 font-medium">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <button className="w-full h-12 bg-blue-600 rounded-lg hover:bg-blue-700 text-white font-medium">
                            Iniciar Sesión
                        </button>

                        <div className="text-center">
                            <p className="text-gray-600">
                                ¿No tienes cuenta?{" "}
                                <Link href="#" className="text-orange-500 hover:text-orange-600 font-medium">
                                    Contacta con nosotros
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium inline-flex items-center">
                        ← Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default page
