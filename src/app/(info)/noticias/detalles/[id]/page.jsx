'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation' 
import Carousel from '@/components/Carousel' 
import { CiCalendarDate } from "react-icons/ci";
import { FaUser } from 'react-icons/fa';
import { MdEmail } from "react-icons/md";
import SkeletonLoader from '../SkeletonLoader';

const NewsDetail = () => {
    const { id } = useParams()
    const [newsData, setNewsData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)


    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/news/${id}`)
                const { data } = await response.json()
                setNewsData(data)
            } catch (err) {
                console.error('Error al obtener la noticia:', err.message)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchNews()
    }, [id])

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    if (loading) {
        return <SkeletonLoader />
    }

    if (error || !newsData) {
        return <p className="text-center mt-10 text-red-500">Error al cargar la noticia.</p>
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-6 pt-24">
            <div className="max-w-3xl mx-auto">
                <div className="flex flex-wrap gap-2 mb-6">
                    {newsData.category?.map((cat, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </span>
                    ))}
                </div>

                {/* Título */}
                <h1 className="text-2xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {newsData.title}
                </h1>

                {/* Autor y fecha */}
                <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 text-sm">
                    <div className="flex items-center gap-2">
                        <FaUser size={22} /> Autor: <span className="font-medium">{newsData.author?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CiCalendarDate size={24} /> <time dateTime={newsData.createdAt}>{formatDate(newsData.createdAt)}</time>
                    </div>
                </div>

                {/* Carrusel */}
                {newsData.images?.length > 0 && (
                    <div className="mb-5">
                        <Carousel images={newsData.images} />
                    </div>
                )}

                {/* Contenido */}
                <div className="bg-white shadow-md rounded-lg p-6 leading-relaxed text-gray-800">
                    {newsData.content.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">
                            {paragraph}
                        </p>
                    ))}
                </div>

                {/* Autor */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 shadow-md flex items-center gap-6">
                    {/* Avatar del autor */}
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-2xl font-bold">
                            {newsData.author?.name?.charAt(0) || "A"}
                        </div>
                    </div>

                    {/* Información del autor */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <FaUser className="text-blue-800" /> {newsData.author?.name}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                            <MdEmail className='text-blue-800'/> {newsData.author?.email || "Correo no disponible"}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            Publicado el <span className="font-medium">{formatDate(newsData.createdAt)}</span>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default NewsDetail
