'use client'
import NewsCard from '@/components/NewsCard'
import React, { useEffect, useState } from 'react'
import Loading from './Loading'
import Paginator from '@/components/Paginator'

const Page = () => {
    const [loading, setLoading] = useState(true);
    const [card, setCard] = useState([]);
    const [error, setError] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 6,
        totalCount: 0,
        totalPages: 1,
    });

    const fetchLatestNews = async (page = 1) => {
        setLoading(true)
        setError(false)
        try {
            const response = await fetch(`/api/news?page=${page}&limit=${pagination.limit}&isActive=true`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Error al obtener las noticias');
            }

            const { data } = result;
            const formattedNews = data.news.map((news) => ({
                id: news.id,
                title: news.title,
                content: news.content,
                image: news.images?.[0] || null,
                link: `/noticias/detalles/${news.id}`,
            }));

            setCard(formattedNews);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Error al obtener las noticias:', error.message);
            setError(true);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchLatestNews(pagination.page);
    }, [pagination.page]);


    const handlePageChange = (page) => {
        setPagination((prev) => ({ ...prev, page }));
        fetchLatestNews(page);
    };

    return (
        <div className=' bg-gray-50 py-12 px-6 pt-24'>
            <div className="flex flex-col text-center">
                <h1 className="text-lg md:text-5xl font-bold text-blue-800 mb-4 text-center">Noticias de último momento</h1>
                <p className='text-md text-gray-600 max-w-3xl mx-auto mb-5'>Entérate de las últimas noticias publicadas en nuestro sitio web</p>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
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
                        <Paginator
                            totalItems={pagination.totalCount}
                            itemsPerPage={pagination.limit}
                            currentPage={pagination.page}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}

            </div>
        </div>
    )
}

export default Page;
