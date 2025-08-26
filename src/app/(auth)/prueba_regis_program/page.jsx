'use client'
import React, { useState } from 'react'

const questionTypes = [
  { value: 'text', label: 'Texto' },
  { value: 'number', label: 'Número' },
  { value: 'radio', label: 'Selección (radio)' }
]

const ProgramBuilder = () => {
  const [programName, setProgramName] = useState('')
  const [programDesc, setProgramDesc] = useState('')
  const [programLongDesc, setProgramLongDesc] = useState('')
  const [sections, setSections] = useState([])

  const addSection = () => {
    setSections([...sections, { titulo: '', campos: [] }])
  }

  const updateSectionTitle = (index, value) => {
    const updated = [...sections]
    updated[index].titulo = value
    setSections(updated)
  }

  const addQuestion = (sectionIndex) => {
    const updated = [...sections]
    updated[sectionIndex].campos.push({
      nombre: '',
      tipo: 'text',
      etiqueta: '',
      obligatorio: false,
      opciones: [],
      condiciones: []
    })
    setSections(updated)
  }

  const updateQuestion = (sectionIndex, questionIndex, field, value) => {
    const updated = [...sections]
    updated[sectionIndex].campos[questionIndex][field] = value
    setSections(updated)
  }

  const addOption = (sectionIndex, questionIndex) => {
    const updated = [...sections]
    updated[sectionIndex].campos[questionIndex].opciones.push('')
    setSections(updated)
  }

  const updateOption = (sectionIndex, questionIndex, optionIndex, value) => {
    const updated = [...sections]
    updated[sectionIndex].campos[questionIndex].opciones[optionIndex] = value
    setSections(updated)
  }

  const removeQuestion = (sectionIndex, questionIndex) => {
    const updated = [...sections]
    updated[sectionIndex].campos.splice(questionIndex, 1)
    setSections(updated)
  }

  const removeSection = (sectionIndex) => {
    const updated = [...sections]
    updated.splice(sectionIndex, 1)
    setSections(updated)
  }

  const addCondition = (sectionIndex, questionIndex) => {
    const updated = [...sections]
    updated[sectionIndex].campos[questionIndex].condiciones.push({ campo: '', valor: '' })
    setSections(updated)
  }

  const updateCondition = (sectionIndex, questionIndex, conditionIndex, field, value) => {
    const updated = [...sections]
    updated[sectionIndex].campos[questionIndex].condiciones[conditionIndex][field] = value
    setSections(updated)
  }

  const programJSON = {
    nombre: programName,
    descripcion: programDesc,
    descripcion_larga: programLongDesc,
    secciones: sections
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Crear Programa</h1>

      {/* Datos básicos del programa */}
      <div className="bg-white shadow rounded-lg p-4 space-y-3">
        <label className="block">
          Nombre del Programa:
          <input 
            type="text" 
            className="border p-2 rounded w-full"
            value={programName}
            onChange={e => setProgramName(e.target.value)}
          />
        </label>

        <label className="block">
          Descripción corta:
          <input 
            type="text" 
            className="border p-2 rounded w-full"
            value={programDesc}
            onChange={e => setProgramDesc(e.target.value)}
          />
        </label>

        <label className="block">
          Descripción larga:
          <textarea 
            className="border p-2 rounded w-full"
            value={programLongDesc}
            onChange={e => setProgramLongDesc(e.target.value)}
          />
        </label>
      </div>

      {/* Secciones */}
      {sections.map((section, sIndex) => (
        <div key={sIndex} className="bg-gray-50 p-4 rounded-lg shadow space-y-4">
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Título de la sección"
              className="border p-2 rounded w-full"
              value={section.titulo}
              onChange={(e) => updateSectionTitle(sIndex, e.target.value)}
            />
            <button 
              className="ml-2 bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => removeSection(sIndex)}
            >
              Eliminar sección
            </button>
          </div>

          {section.campos.map((campo, qIndex) => (
            <div key={qIndex} className="bg-white p-3 rounded shadow space-y-2">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  placeholder="Etiqueta de la pregunta"
                  className="border p-2 rounded w-full"
                  value={campo.etiqueta}
                  onChange={(e) => updateQuestion(sIndex, qIndex, 'etiqueta', e.target.value)}
                />
                <button 
                  className="ml-2 bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => removeQuestion(sIndex, qIndex)}
                >
                  Eliminar
                </button>
              </div>

              <input
                type="text"
                placeholder="Nombre interno (sin espacios)"
                className="border p-2 rounded w-full"
                value={campo.nombre}
                onChange={(e) => updateQuestion(sIndex, qIndex, 'nombre', e.target.value)}
              />

              <select
                className="border p-2 rounded w-full"
                value={campo.tipo}
                onChange={(e) => updateQuestion(sIndex, qIndex, 'tipo', e.target.value)}
              >
                {questionTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>

              {/* Opciones si es radio */}
              {campo.tipo === 'radio' && (
                <div className="space-y-2">
                  {campo.opciones.map((opt, oIndex) => (
                    <input
                      key={oIndex}
                      type="text"
                      placeholder={`Opción ${oIndex + 1}`}
                      className="border p-2 rounded w-full"
                      value={opt}
                      onChange={(e) => updateOption(sIndex, qIndex, oIndex, e.target.value)}
                    />
                  ))}
                  <button 
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => addOption(sIndex, qIndex)}
                  >
                    Agregar opción
                  </button>
                </div>
              )}

              {/* Condiciones */}
              <div className="space-y-2">
                {campo.condiciones.map((cond, cIndex) => (
                  <div key={cIndex} className="flex gap-2">
                    <select
                      className="border p-2 rounded w-1/2"
                      value={cond.campo}
                      onChange={(e) => updateCondition(sIndex, qIndex, cIndex, 'campo', e.target.value)}
                    >
                      <option value="">Pregunta de la que depende</option>
                      {section.campos.map((c, idx) => (
                        idx !== qIndex && <option key={idx} value={c.nombre}>{c.etiqueta}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Valor requerido"
                      className="border p-2 rounded w-1/2"
                      value={cond.valor}
                      onChange={(e) => updateCondition(sIndex, qIndex, cIndex, 'valor', e.target.value)}
                    />
                  </div>
                ))}
                <button 
                  className="bg-purple-500 text-white px-2 py-1 rounded"
                  onClick={() => addCondition(sIndex, qIndex)}
                >
                  Agregar condición
                </button>
              </div>
            </div>
          ))}

          <button 
            className="bg-green-500 text-white px-3 py-1 rounded"
            onClick={() => addQuestion(sIndex)}
          >
            Agregar pregunta
          </button>
        </div>
      ))}

      <button 
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={addSection}
      >
        Agregar sección
      </button>

      {/* JSON Preview */}
      <div className="bg-black text-green-400 p-4 rounded-lg mt-6 text-sm overflow-auto">
        <pre>{JSON.stringify(programJSON, null, 2)}</pre>
      </div>
    </div>
  )
}

export default ProgramBuilder
