'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

const LoginPage = () => {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleLogin(e) {
        e.preventDefault()
        setError('')
        setLoading(true)
        
        const formData = new FormData(e.target)
        const email = formData.get("email")
        const password = formData.get("password")
        
        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl: "/dashboard"
            })
            
            if (result?.error) {
                if (result.error === "CredentialsSignin") {
                    setError("Credenciales incorrectas. Por favor verifica tu email y contraseña.")
                } else {
                    setError("Error de autenticación. Por favor intenta nuevamente.")
                }
            } else if (result?.ok) {
                // Esperar un poco antes de redirigir para asegurar que la sesión esté lista
                setTimeout(() => {
                    router.push("/dashboard")
                    router.refresh()
                }, 100)
            }
        } catch (error) {
            setError("Ocurrió un error inesperado. Por favor intenta nuevamente.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 h-screen">
            <div className="w-full max-w-md  ">
                <div className="shadow-xl border-0 p-8 rounded-xl ">
                    <div className="text-center pb-8">
                        <div className="text-3xl font-bold text-gray-900">Iniciar Sesión</div>
                        <p className="text-gray-600 mt-2">Accede a tu cuenta de la fundación</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2 flex flex-col gap-2">
                            <label htmlFor="email" className="text-gray-700 font-medium">
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
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
                                name="password"
                                type="password"
                                required
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

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-blue-600 rounded-lg hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-gray-600">
                            ¿No tienes cuenta?{" "}
                            <Link href="#" className="text-orange-500 hover:text-orange-600 font-medium">
                                Contacta con nosotros
                            </Link>
                        </p>
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

export default LoginPage
