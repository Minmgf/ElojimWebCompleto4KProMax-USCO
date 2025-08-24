'use client'

import React, { useState, useMemo } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table'
import { useNews, useDeleteNews } from '@/hooks/useNews'
import { toast } from 'sonner'
import * as Dialog from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"
import { FaEdit, FaTrash, FaEye, FaArrowLeft , FaArrowRight  } from 'react-icons/fa'
import NewsModal from './NewsModal'

const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, loading, newsTitle }) => (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg z-50 w-full max-w-md">
                <div className="p-6">
                    <Dialog.Title className="text-lg font-bold mb-4 text-red-600">
                        Confirmar eliminación
                    </Dialog.Title>

                    <p className="text-gray-700 mb-6">
                        ¿Estás seguro de que quieres eliminar la noticia "<strong>{newsTitle}</strong>"?
                        Esta acción no se puede deshacer.
                    </p>

                    <div className="flex justify-end gap-3">
                        <Dialog.Close asChild>
                            <button
                                type="button"
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                        </Dialog.Close>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Eliminando...' : 'Eliminar'}
                        </button>
                    </div>
                </div>

                <Dialog.Close asChild>
                    <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        aria-label="Cerrar"
                    >
                        <Cross2Icon />
                    </button>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
)

const NewsData = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedNews, setSelectedNews] = useState(null)

    const { news, pagination, loading, error, refetch } = useNews({
        page: currentPage,
        limit: 10
    })

    const { deleteNews, loading: deleteLoading } = useDeleteNews()

    // Función para formatear la fecha
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
    }

    // Función para formatear categorías
    const formatCategories = (categories) => {
        if (!categories || categories.length === 0) return 'General'
        return categories.map(cat => (
            <span
                key={cat}
                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
            >
                {cat}
            </span>
        ))
    }

    // Función para formatear estado
    const formatStatus = (isActive, important) => {
        if (important) {
            return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Importante</span>
        }
        if (isActive) {
            return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Publicado</span>
        }
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Borrador</span>
    }

    // Configuración de columnas
    const columns = useMemo(() => [
        {
            accessorKey: 'title',
            header: 'Título',
            cell: ({ row }) => (
                <div className="max-w-xs">
                    <div className="font-medium text-gray-900 truncate">
                        {row.original.title}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                        Por: {row.original.author?.name || 'Desconocido'}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'category',
            header: 'Categoría',
            cell: ({ row }) => formatCategories(row.original.category),
        },
        {
            accessorKey: 'createdAt',
            header: 'Fecha',
            cell: ({ row }) => formatDate(row.original.createdAt),
        },
        {
            accessorKey: 'status',
            header: 'Estado',
            cell: ({ row }) => formatStatus(row.original.isActive, row.original.important),
        },
        {
            id: 'actions',
            header: 'Acciones',
            size: 120, // Ancho fijo más pequeño
            cell: ({ row }) => (
                <div className="flex gap-1 justify-center">
                    <button
                        onClick={() => handleEdit(row.original)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded shadow-sm"
                        title="Editar"
                    >
                        <FaEdit size={14} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.original)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded shadow-sm"
                        title="Eliminar"
                    >
                        <FaTrash size={14} />
                    </button>
                </div>
            ),
        },
    ], [])

    // Configuración de la tabla
    const table = useReactTable({
        data: news || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        pageCount: pagination?.totalPages || 0,
        state: {
            pagination: {
                pageIndex: currentPage - 1,
                pageSize: 10,
            },
        },
        onPaginationChange: (updater) => {
            const newPagination = typeof updater === 'function'
                ? updater({ pageIndex: currentPage - 1, pageSize: 10 })
                : updater
            setCurrentPage(newPagination.pageIndex + 1)
        },
        manualPagination: true,
    })

    // Handlers
    const handleEdit = (newsItem) => {
        setSelectedNews(newsItem)
        setEditModalOpen(true)
    }

    const handleDelete = (newsItem) => {
        setSelectedNews(newsItem)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!selectedNews) return

        try {
            const success = await deleteNews(selectedNews.id)
            if (success) {
                toast.success('Noticia eliminada exitosamente')
                setDeleteDialogOpen(false)
                setSelectedNews(null)
                refetch() // Refrescar la lista
            }
        } catch (error) {
            toast.error('Error al eliminar la noticia')
        }
    }

    const handleEditSuccess = () => {
        setEditModalOpen(false)
        setSelectedNews(null)
        refetch() // Refrescar la lista
        toast.success('Noticia actualizada exitosamente')
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Cargando noticias...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                Error al cargar las noticias: {error}
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className={`${
                                            header.id === 'actions'
                                                ? 'px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32'
                                                : 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                        }`}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())
                                        }
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map(cell => (
                                    <td
                                        key={cell.id}
                                        className={`${
                                            cell.column.id === 'actions' 
                                                ? 'px-3 py-4 whitespace-nowrap text-sm text-gray-900 w-32' 
                                                : 'px-6 py-4 whitespace-nowrap text-sm text-gray-900'
                                        }`}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            {pagination && (
                <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={!pagination.hasPrev}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={!pagination.hasNext}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Siguiente
                        </button>
                    </div>

                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Mostrando{' '}
                                <span className="font-medium">{((currentPage - 1) * 10) + 1}</span>
                                {' '}a{' '}
                                <span className="font-medium">
                                    {Math.min(currentPage * 10, pagination?.totalCount || 0)}
                                </span>
                                {' '}de{' '}
                                <span className="font-medium">{pagination?.totalCount || 0}</span>
                                {' '}resultados
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={!pagination.hasPrev}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaArrowLeft />
                                </button>

                                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                    Página {currentPage} de {pagination.totalPages}
                                </span>

                                <button
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    disabled={!pagination.hasNext}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaArrowRight />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de edición */}
            {editModalOpen && selectedNews && (
                <NewsModal
                    isEdit={true}
                    editData={selectedNews}
                    trigger={null}
                    isOpen={editModalOpen}
                    onOpenChange={setEditModalOpen}
                    onSuccess={handleEditSuccess}
                />
            )}

            {/* Dialog de confirmación de eliminación */}
            <DeleteConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={() => {
                    setDeleteDialogOpen(false)
                    setSelectedNews(null)
                }}
                onConfirm={confirmDelete}
                loading={deleteLoading}
                newsTitle={selectedNews?.title || ''}
            />
        </div>
    )
}

export default NewsData
