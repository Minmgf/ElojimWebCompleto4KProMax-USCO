'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/dashboard/tabs'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaListUl, FaNewspaper, FaSignOutAlt } from 'react-icons/fa'
import Select from 'react-select'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const DashboardPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [programs, setPrograms] = useState([])
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [formData, setFormData] = useState({})

  // 🔹 Llamar al endpoint al cargar
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch('/api/programas/gestion-programas')
        const data = await res.json()
        console.log(data)
        setPrograms(data)
      } catch (error) {
        console.error("Error cargando programas:", error)
      }
    }
    fetchPrograms()
  }, [])

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

  

  const handleChange = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }))
  }

  const renderField = (campo) => {
    // 🔹 Verificar condiciones
    if (campo.condiciones) {
      const cumple = campo.condiciones.every((cond) => formData[cond.campo] === cond.valor)
      if (!cumple) return null
    }

    switch (campo.tipo) {
      case "text":
      case "number":
      case "email":
      case "date":
        return (
          <div key={campo.nombre} className="flex flex-col mb-4">
            <label className="font-semibold">{campo.etiqueta}{campo.obligatorio && '*'}</label>
            <input
              type={campo.tipo}
              value={formData[campo.nombre] || ""}
              onChange={(e) => handleChange(campo.nombre, e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>
        )
      case "radio":
        return (
          <div key={campo.nombre} className="flex flex-col mb-4">
            <label className="font-semibold">{campo.etiqueta}{campo.obligatorio && '*'}</label>
            <div className="flex gap-4 mt-2">
              {campo.opciones.map((op) => (
                <label key={op} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={campo.nombre}
                    value={op}
                    checked={formData[campo.nombre] === op}
                    onChange={() => handleChange(campo.nombre, op)}
                  />
                  {op}
                </label>
              ))}
            </div>
          </div>
        )
      case "select":
        return (
          <div key={campo.nombre} className="flex flex-col mb-4">
            <label className="font-semibold">{campo.etiqueta}{campo.obligatorio && '*'}</label>
            <select
              value={formData[campo.nombre] || ""}
              onChange={(e) => handleChange(campo.nombre, e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">Seleccione...</option>
              {campo.opciones.map((op, idx) => (
                <option key={idx} value={op}>{op}</option>
              ))}
            </select>
          </div>
        )
      case "textarea":
        return (
          <div key={campo.nombre} className="flex flex-col mb-4">
            <label className="font-semibold">{campo.etiqueta}{campo.obligatorio && '*'}</label>
            <textarea
              value={formData[campo.nombre] || ""}
              onChange={(e) => handleChange(campo.nombre, e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>
        )
      default:
        return null
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Datos guardados:", formData)
  }

  return (
    <div className='bg-gradient-to-br from-blue-50 to-orange-50 min-h-screen'>
      <header className="bg-white z-50 shadow-sm border-b border-b-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Select 
                  options={programs.map(p => ({ value: p.id, label: p.name, data: p }))}
                  onChange={(val) => setSelectedProgram(val?.data)}
                />
              </div>

              {selectedProgram && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {selectedProgram.specificInformation?.secciones?.map((sec, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-lg border">
                      <h3 className="text-lg font-bold mb-4">{sec.titulo}</h3>
                      {sec.campos.map((campo) => renderField(campo))}
                    </div>
                  ))}

                  <button 
                    type="submit" 
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Guardar
                  </button>
                </form>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default DashboardPage
