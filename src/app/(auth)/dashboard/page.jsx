'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/dashboard/tabs'
import Link from 'next/link'
import React from 'react'
import { FaArrowLeft, FaListUl, FaNewspaper } from 'react-icons/fa'
import Select from 'react-select'

const programs = [
    { value: 'Opcion 1', label: 'Opcion 1' },
    { value: 'Opcion 2', label: 'Opcion 2' },
    { value: 'Opcion 3', label: 'Opcion 3' }
]

const page = () => {
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
                                <p className="text-xs text-gray-600">Fundación Elojim Jadach</p>
                            </div>
                        </div>
                        <div className="flex gap-2 ">
                        <Link href="/" variant="outline" className="bg-transparent px-4 py-2 rounded-lg hover:bg-gray-100 items-center flex gap-2">
                            <FaArrowLeft />
                            Volver
                        </Link>
                        <Link href="/" variant="outline" className="bg-gray-50 px-4 py-2 rounded-lg hover:bg-gray-100">
                            Cerrar sesión
                        </Link>
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

export default page
