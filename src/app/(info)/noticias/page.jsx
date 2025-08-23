'use client'
import NewsCard from '@/components/NewsCard'
import React, { useEffect, useState } from 'react'
import Loading from './Loading'

const Page = () => {
    const [loading, setLoading] = useState(true);
    const [card, setCard] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchLatestNews = async () => {
            try {
                const data = {
                    data: {
                        latestNews: [
                            {
                                id: 1,
                                title: "Lanzamiento del nuevo programa social",
                                content: "Se ha lanzado un nuevo programa para apoyar a jóvenes emprendedores.",
                            },
                            {
                                id: 2,
                                title: "Conferencia internacional en la ciudad",
                                content: "Expertos de todo el mundo se reúnen para debatir sobre innovación.",
                            },
                            {
                                id: 3,
                                title: "Iniciativa verde para la comunidad",
                                content: "Se inicia un plan de reforestación en parques y zonas verdes.",
                            },
                            {
                                id: 4,
                                title: "Nueva plataforma educativa",
                                content: "Se lanza una plataforma para el aprendizaje en línea.",
                            },
                            {
                                id: 5,
                                title: "Mejoras en el transporte público",
                                content: "El sistema de transporte implementa nuevas rutas sostenibles.",
                            },
                            {
                                id: 6,
                                title: "Festival cultural en el centro",
                                content: "Se celebrará un festival con gastronomía, música y arte local.",
                            }
                        ]
                    }
                };

                const formattedNews = data.data.latestNews.map((news) => ({
                    id: news.id,
                    title: news.title,
                    content: news.content,
                    image: news.image_urls?.[0] || null,
                    link: `/detailedNotice/${news.id}`,
                }));

                setCard(formattedNews);
            } catch (error) {
                console.error('Error al obtener las noticias:', error.message);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestNews();
    }, []);

    return (
        <div className=' bg-gray-50 py-12 px-6 pt-24'>
            <div className="flex flex-col text-center">
                <h1 className="text-lg md:text-5xl font-bold text-blue-800 mb-4 text-center">Noticias de ultimo momento</h1>
                <p className='text-md text-gray-600 max-w-3xl mx-auto mb-5'>Enterate de las ultimas noticias publicadas en nuestro sitio web</p>
            </div>
            <div className="w-full my-5">
                {loading ? (
                    <div className="grid grid-cols-1 mx-auto md:grid-cols-3 gap-4 w-full max-w-5xl p-4">
                        {[...Array(6)].map((_, index) => (
                            <Loading key={index} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col mx-auto p-4 w-full max-w-5xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {card.map((newsItem) => (
                                <NewsCard
                                    key={newsItem.id}
                                    className="shadow-md"
                                    image={newsItem.image}
                                    title={newsItem.title}
                                    description={newsItem.content}
                                    href={newsItem.link}
                                />
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Page;
