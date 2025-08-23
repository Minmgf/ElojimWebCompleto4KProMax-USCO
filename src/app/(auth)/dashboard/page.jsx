'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/dashboard/tabs'
import Link from 'next/link'
import React from 'react'
import { FaArrowLeft, FaListUl, FaNewspaper, FaSignOutAlt } from 'react-icons/fa'
import Select from 'react-select'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const programs = [
    { value: 'Opcion 1', label: 'Opcion 1' },
    { value: 'Opcion 2', label: 'Opcion 2' },
    { value: 'Opcion 3', label: 'Opcion 3' }
]

const DashboardPage = () => {
    const { data: session, status } = useSession()
    const router = useRouter()

    const handleLogout = async () => {
        await signOut({ 
            callbackUrl: '/',
            redirect: true 
        })
    }

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-orange-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando dashboard...</p>
                </div>
            </div>
        )
    }

    if (status === "unauthenticated") {
        router.push('/login')
        return null
    }
    return (
        <div className='bg-gradient-to-br from-blue-50 to-orange-50 h-screen'>
            <header className="bg-white z-50 shadow-sm border-b border-b-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10  rounded-lg flex items-center justify-center">
                                <img src="./logo2.webp" className='object-scale-down w-32 h-32 mx-4' alt="" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Dashboard Administrativo</h1>
                                <p className="text-xs text-gray-600">
                                    Bienvenido, {session?.user?.name || 'Usuario'} | Fundación Elojim Jadach
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 ">
                        <Link href="/" className="bg-transparent px-4 py-2 rounded-lg hover:bg-gray-100 items-center flex gap-2 text-gray-700">
                            <FaArrowLeft />
                            Volver
                        </Link>
                        <button 
                            onClick={handleLogout}
                            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 flex items-center gap-2"
                        >
                            <FaSignOutAlt />
                            Cerrar sesión
                        </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs defaultValue="noticias" className="w-full">
                    <TabsList className="grid w-1/2 grid-cols-2 bg-white">
                        <TabsTrigger value="noticias" className='flex gap-2'>
                            <FaNewspaper /> Noticias
                        </TabsTrigger>
                        <TabsTrigger value="programas" className='flex gap-2'>
                            <FaListUl /> Programas
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="noticias" className="space-y-4">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold mb-4">Gestión de Noticias</h2>
                        </div>
                    </TabsContent>

                    <TabsContent value="programas" className="space-y-4">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold mb-4">Gestión de Programas</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Select options={programs} />

                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default DashboardPage
