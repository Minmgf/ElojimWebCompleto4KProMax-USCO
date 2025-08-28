'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa6'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const News = () => {
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/news?limit=5&isActive=true&page=1')
                
                if (!response.ok) {
                    throw new Error('Error al cargar las noticias')
                }
                
                const result = await response.json()
                
                if (result.success && result.data?.news) {
                    setNews(result.data.news)
                } else {
                    throw new Error('No se encontraron noticias')
                }
            } catch (error) {
                console.error('Error fetching news:', error)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchNews()
    }, [])

    // Función para truncar el contenido
    const truncateContent = (content, maxLength = 120) => {
        if (content.length <= maxLength) return content
        return content.substring(0, maxLength) + '...'
    }

    // Función para formatear la categoría
    const formatCategory = (categories) => {
        if (!categories || categories.length === 0) return 'General'
        return categories[0].charAt(0).toUpperCase() + categories[0].slice(1)
    }
    return (
        <section className="py-20 bg-white" id='noticias'>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Últimas Noticias</h2>
                    <p className="text-xl text-gray-600">
                        Mantente informado sobre nuestros proyectos, eventos y el impacto que generamos en la comunidad
                    </p>
                </div>

                <div className="mb-8">
                    {loading ? (
                        // Skeleton loader
                        <div className="grid md:grid-cols-3 gap-8">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="animate-pulse">
                                    <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                                    <div className="p-6">
                                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                        <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        // Error state
                        <div className="text-center py-12">
                            <p className="text-gray-600 mb-4">Error al cargar las noticias</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : news.length === 0 ? (
                        // Empty state
                        <div className="text-center py-12">
                            <p className="text-gray-600">No hay noticias disponibles</p>
                        </div>
                    ) : (
                        // News slider
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={30}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 30,
                                },
                            }}
                            className="news-swiper"
                        >
                            {news.map((newsItem) => (
                                <SwiperSlide key={newsItem.id}>
                                    <div className="group border border-gray-200 rounded-xl hover:shadow-lg transition-shadow h-full">
                                        <div className="aspect-video bg-gradient-to-br from-blue-100 to-orange-100 rounded-t-lg overflow-hidden">
                                            <Image
                                                src={newsItem.images?.[0] || '/logo.webp'}
                                                alt={newsItem.title}
                                                width={300}
                                                height={200}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-6 flex flex-col h-full">
                                            <div className="text-sm text-blue-600 font-medium mb-2">
                                                {formatCategory(newsItem.category)}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {newsItem.title}
                                            </h3>
                                            <p className="text-gray-600 mb-4 flex-grow">
                                                {truncateContent(newsItem.content)}
                                            </p>
                                            <Link 
                                                href={`/noticias/detalles/${newsItem.id}`}
                                                className="flex items-center gap-2 py-2 px-4 text-blue-600 hover:text-blue-700 w-fit"
                                            >
                                                Leer más <FaArrowRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </div>
                <Link href={'/noticias'}  className="flex max-w-sm justify-center  mx-auto my-4 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                    Ver mas noticias
                    <FaArrowRight className="ml-2 h-5 w-5" />
                </Link>
        </section>
    )
}

export default News
