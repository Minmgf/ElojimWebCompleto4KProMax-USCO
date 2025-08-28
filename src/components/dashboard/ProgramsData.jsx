'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
} from '@tanstack/react-table'
import { toast } from 'sonner'
import * as Dialog from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"
import { FaEye, FaArrowLeft, FaArrowRight, FaUsers, FaCalendar, FaIdCard, FaPhone, FaEnvelope, FaSearch } from 'react-icons/fa'

const ProgramsData = () => {
    const [programs, setPrograms] = useState([])
    const [selectedProgramId, setSelectedProgramId] = useState('')
    const [registros, setRegistros] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalRegistros, setTotalRegistros] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [viewModalOpen, setViewModalOpen] = useState(false)
    const [selectedRegistro, setSelectedRegistro] = useState(null)
    const [registroDetails, setRegistroDetails] = useState(null)

    // Cargar programas al montar el componente
    useEffect(() => {
        fetchPrograms()
    }, [])

    // Cargar registros cuando cambie el programa seleccionado o la página
    useEffect(() => {
        if (selectedProgramId) {
            fetchRegistros(selectedProgramId, currentPage, pageSize, searchTerm)
        } else {
            setRegistros([])
            setTotalRegistros(0)
        }
    }, [selectedProgramId, currentPage, pageSize])

    // Función para cargar programas
    const fetchPrograms = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/programas/gestion-programas')
            if (!response.ok) throw new Error('Error al cargar programas')
            const data = await response.json()
            setPrograms(data)
        } catch (error) {
            console.error('Error cargando programas:', error)
            toast.error('Error al cargar los programas')
        } finally {
            setLoading(false)
        }
    }

    // Función para cargar registros del programa seleccionado con paginación
    const fetchRegistros = async (programaId, page = 1, size = 10, search = '') => {
        try {
            setLoading(true)
            setError(null)
            
            // Construir URL con parámetros de paginación y búsqueda
            const params = new URLSearchParams({
                page: page.toString(),
                limit: size.toString()
            })
            
            if (search.trim()) {
                params.append('search', search.trim())
            }
            
            const response = await fetch(`/api/programas/registros-by-programa/${programaId}?${params}`)
            if (!response.ok) throw new Error('Error al cargar registros')
            const data = await response.json()
            
            setRegistros(data.registros || [])
            setTotalRegistros(data.totalRegistros || 0)
        } catch (error) {
            console.error('Error cargando registros:', error)
            setError('Error al cargar los registros del programa')
            toast.error('Error al cargar los registros')
        } finally {
            setLoading(false)
        }
    }

    // Función para cargar detalles completos del registro
    const fetchRegistroDetails = async (registroId) => {
        try {
            const response = await fetch(`/api/programas/registro-programas/${registroId}`)
            if (!response.ok) throw new Error('Error al cargar detalles')
            const data = await response.json()
            setRegistroDetails(data)
        } catch (error) {
            console.error('Error cargando detalles:', error)
            toast.error('Error al cargar los detalles del registro')
        }
    }

    // Función para formatear la fecha
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
    }

    // Función para formatear información específica
    const formatSpecificInfo = (specificInfo) => {
        if (!specificInfo || typeof specificInfo !== 'object') return 'N/A'
        
        const infoArray = []
        Object.entries(specificInfo).forEach(([key, value]) => {
            if (value && value !== '') {
                const formattedKey = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                if (Array.isArray(value)) {
                    infoArray.push(`${formattedKey}: ${value.join(', ')}`)
                } else {
                    infoArray.push(`${formattedKey}: ${value}`)
                }
            }
        })
        
        return infoArray.length > 0 ? infoArray.join(' | ') : 'N/A'
    }

    // Configuración de columnas
    const columns = useMemo(() => [
        {
            accessorKey: 'fullName',
            header: 'Nombre Completo',
            cell: ({ row }) => (
                <div className="max-w-xs">
                    <div className="font-medium text-gray-900 truncate">
                        {row.original.fullName}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                        <FaIdCard className="text-blue-500" />
                        {row.original.typeDocument} {row.original.numDocument}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'age',
            header: 'Edad',
            cell: ({ row }) => (
                <div className="text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {row.original.age || 'N/A'} años
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'gender',
            header: 'Género',
            cell: ({ row }) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    row.original.gender === 'FEMENINO' 
                        ? 'bg-pink-100 text-pink-800' 
                        : 'bg-blue-100 text-blue-800'
                }`}>
                    {row.original.gender}
                </span>
            ),
        },
        {
            accessorKey: 'comune',
            header: 'Comuna',
            cell: ({ row }) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {row.original.comune}
                </span>
            ),
        },
        {
            accessorKey: 'contact',
            header: 'Contacto',
            cell: ({ row }) => (
                <div className="max-w-xs">
                    <div className="text-sm text-gray-900 flex items-center gap-1 mb-1">
                        <FaPhone className="text-green-500" />
                        {row.original.phone || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                        <FaEnvelope className="text-blue-500" />
                        {row.original.email || 'N/A'}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'Fecha de Registro',
            cell: ({ row }) => (
                <div className="text-sm text-gray-900">
                    {formatDate(row.original.createdAt)}
                </div>
            ),
        },
        {
            id: 'actions',
            header: 'Acciones',
            size: 100,
            cell: ({ row }) => (
                <div className="flex gap-1 justify-center">
                    <button
                        onClick={() => handleView(row.original)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded shadow-sm transition-colors"
                        title="Ver detalles"
                    >
                        <FaEye size={14} />
                    </button>
                </div>
            ),
        },
    ], [])

    // Configuración de la tabla
    const table = useReactTable({
        data: registros,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            pagination: {
                pageIndex: currentPage - 1,
                pageSize: pageSize,
            },
        },
        onPaginationChange: (updater) => {
            const newPagination = typeof updater === 'function'
                ? updater({ pageIndex: currentPage - 1, pageSize: pageSize })
                : updater
            setCurrentPage(newPagination.pageIndex + 1)
            setPageSize(newPagination.pageSize)
        },
        manualPagination: true,
        pageCount: Math.ceil(totalRegistros / pageSize),
    })

    // Handlers
    const handleView = async (registro) => {
        setSelectedRegistro(registro)
        setViewModalOpen(true)
        await fetchRegistroDetails(registro.id)
    }

    const handleProgramChange = (e) => {
        setSelectedProgramId(e.target.value)
        setCurrentPage(1) // Resetear a la primera página
        setSearchTerm('') // Limpiar búsqueda
    }

    const handleSearch = (e) => {
        e.preventDefault()
        setCurrentPage(1) // Resetear a la primera página
        fetchRegistros(selectedProgramId, 1, pageSize, searchTerm)
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
    }

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize)
        setCurrentPage(1) // Resetear a la primera página
    }

    if (loading && !selectedProgramId) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Cargando programas...</span>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Select de programas */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                    <FaUsers className="text-blue-600 text-xl" />
                    <h3 className="text-lg font-semibold text-gray-900">Seleccionar Programa</h3>
                </div>
                <select
                    value={selectedProgramId}
                    onChange={handleProgramChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={loading}
                >
                    <option value="">Selecciona un programa para ver sus registros</option>
                    {programs.map((program) => (
                        <option key={program.id} value={program.id}>
                            {program.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tabla de registros */}
            {selectedProgramId && (
                <div className="bg-white rounded-lg shadow">
                    {/* Header de la tabla con buscador */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <FaCalendar className="text-blue-600" />
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Registros del Programa
                                </h3>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    {totalRegistros} inscritos
                                </span>
                            </div>
                            
                            {/* Buscador */}
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Buscar
                                </button>
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchTerm('')
                                            setCurrentPage(1)
                                            fetchRegistros(selectedProgramId, 1, pageSize, '')
                                        }}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-2">Cargando registros...</span>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg mx-6 my-4">
                            {error}
                        </div>
                    ) : registros.length === 0 ? (
                        <div className="text-center py-12">
                            <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                {searchTerm ? 'No se encontraron resultados' : 'No hay registros'}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm 
                                    ? `No se encontraron registros que coincidan con "${searchTerm}"`
                                    : 'No se han encontrado inscripciones para este programa.'
                                }
                            </p>
                        </div>
                    ) : (
                        <>
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
                                                                ? 'px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24'
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
                                            <tr key={row.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleView(row.original)}>
                                                {row.getVisibleCells().map(cell => (
                                                    <td
                                                        key={cell.id}
                                                        className={`${
                                                            cell.column.id === 'actions' 
                                                                ? 'px-3 py-4 whitespace-nowrap text-sm text-gray-900 w-24' 
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
                            {totalRegistros > 0 && (
                                <div className="px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 gap-4">
                                    {/* Información de páginas */}
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Mostrando{' '}
                                                <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span>
                                                {' '}a{' '}
                                                <span className="font-medium">
                                                    {Math.min(currentPage * pageSize, totalRegistros)}
                                                </span>
                                                {' '}de{' '}
                                                <span className="font-medium">{totalRegistros}</span>
                                                {' '}resultados
                                            </p>
                                        </div>
                                        
                                        {/* Selector de tamaño de página */}
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-700">Mostrar:</label>
                                            <select
                                                value={pageSize}
                                                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                                            >
                                                <option value={5}>5</option>
                                                <option value={10}>10</option>
                                                <option value={20}>20</option>
                                                <option value={50}>50</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Navegación de páginas */}
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <FaArrowLeft />
                                            </button>

                                            {/* Páginas numeradas */}
                                            {Array.from({ length: Math.min(5, Math.ceil(totalRegistros / pageSize)) }, (_, i) => {
                                                const pageNum = i + 1
                                                const isCurrentPage = pageNum === currentPage
                                                
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium ${
                                                            isCurrentPage
                                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                )
                                            })}

                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage >= Math.ceil(totalRegistros / pageSize)}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <FaArrowRight />
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Modal para ver detalles del registro */}
            {viewModalOpen && selectedRegistro && (
                <Dialog.Root open={viewModalOpen} onOpenChange={setViewModalOpen}>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
                        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg z-50 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <Dialog.Title className="text-2xl font-bold text-gray-900">
                                        Detalles del Registro
                                    </Dialog.Title>
                                    <Dialog.Close asChild>
                                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                            <Cross2Icon className="h-6 w-6" />
                                        </button>
                                    </Dialog.Close>
                                </div>

                                {registroDetails ? (
                                    <div className="space-y-6">
                                        {/* Información personal */}
                                        <div className="bg-gray-50 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <FaUsers className="text-blue-600" />
                                                Información Personal
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Nombre Completo</label>
                                                    <p className="text-gray-900">{registroDetails.fullName}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Documento</label>
                                                    <p className="text-gray-900">{registroDetails.typeDocument} {registroDetails.numDocument}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Edad</label>
                                                    <p className="text-gray-900">{registroDetails.age} años</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Género</label>
                                                    <p className="text-gray-900">{registroDetails.gender}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Comuna</label>
                                                    <p className="text-gray-900">{registroDetails.comune}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Estrato</label>
                                                    <p className="text-gray-900">{registroDetails.socialStratum}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Grupo Étnico</label>
                                                    <p className="text-gray-900">{registroDetails.etnicalGroup}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Fecha de Nacimiento</label>
                                                    <p className="text-gray-900">{formatDate(registroDetails.birthDate)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Información de contacto */}
                                        <div className="bg-blue-50 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <FaPhone className="text-blue-600" />
                                                Información de Contacto
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Dirección</label>
                                                    <p className="text-gray-900">{registroDetails.address || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Teléfono</label>
                                                    <p className="text-gray-900">{registroDetails.phone || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Email</label>
                                                    <p className="text-gray-900">{registroDetails.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Motivación y expectativas */}
                                        <div className="bg-green-50 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                Motivación y Expectativas
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Motivación</label>
                                                    <p className="text-gray-900">{registroDetails.motivation || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Expectativas</label>
                                                    <p className="text-gray-900">{registroDetails.expectations || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Información específica del programa */}
                                        {registroDetails.specificInformation && Object.keys(registroDetails.specificInformation).length > 0 && (
                                            <div className="bg-purple-50 p-6 rounded-lg">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                    Información Específica del Programa
                                                </h3>
                                                <div className="space-y-3">
                                                    {Object.entries(registroDetails.specificInformation).map(([key, value]) => {
                                                        if (value && value !== '' && (Array.isArray(value) ? value.length > 0 : true)) {
                                                            const formattedKey = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                                                            const displayValue = Array.isArray(value) ? value.join(', ') : value
                                                            return (
                                                                <div key={key}>
                                                                    <label className="text-sm font-medium text-gray-500">{formattedKey}</label>
                                                                    <p className="text-gray-900">{displayValue}</p>
                                                                </div>
                                                            )
                                                        }
                                                        return null
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Fechas */}
                                        <div className="bg-yellow-50 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                Información del Registro
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Fecha de Creación</label>
                                                    <p className="text-gray-900">{formatDate(registroDetails.createdAt)}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Última Actualización</label>
                                                    <p className="text-gray-900">{formatDate(registroDetails.updatedAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <span className="ml-2">Cargando detalles...</span>
                                    </div>
                                )}
                            </div>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            )}
        </div>
    )
}

export default ProgramsData
