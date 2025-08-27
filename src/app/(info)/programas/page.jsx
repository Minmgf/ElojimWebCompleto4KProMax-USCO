"use client";
import { useState } from "react";

export default function ProgramFormModal({ program, onClose }) {
  const [formData, setFormData] = useState({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  const renderField = (campo) => {
    switch (campo.tipo) {
      case "text":
      case "number":
      case "email":
      case "date":
        return (
          <div key={campo.nombre} className="flex flex-col mb-4">
            <label className="font-semibold">{campo.etiqueta}</label>
            <input
              type={campo.tipo}
              value={formData[campo.nombre] || ""}
              onChange={(e) => handleChange(campo.nombre, e.target.value)}
              className="border rounded px-3 py-2"
              required={campo.requerido || false}
            />
          </div>
        );
      case "radio":
        return (
          <div key={campo.nombre} className="flex flex-col mb-4">
            <label className="font-semibold">{campo.etiqueta}</label>
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
        );
      case "select":
        return (
          <div key={campo.nombre} className="flex flex-col mb-4">
            <label className="font-semibold">{campo.etiqueta}</label>
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
        );
      case "textarea":
        return (
          <div key={campo.nombre} className="flex flex-col mb-4">
            <label className="font-semibold">{campo.etiqueta}</label>
            <textarea
              value={formData[campo.nombre] || ""}
              onChange={(e) => handleChange(campo.nombre, e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!acceptTerms) {
      alert("Debes aceptar los términos y condiciones");
      return;
    }

    const payload = {
      programId: program.id,
      ...formData
    };

    console.log("Datos a enviar:", payload);

    const res = await fetch("/api/programas/registro-programas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert("Inscripción enviada con éxito");
      onClose();
    } else {
      alert("Error al enviar la inscripción");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        {program ? (
        <h2 className="text-2xl font-bold text-blue-800 mb-6">
            Inscripción: {program.name}
        </h2>
        ) : (
        <h2 className="text-2xl font-bold text-gray-500 mb-6">Cargando...</h2>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ✅ Bloque fijo: Datos personales */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-lg font-bold mb-4">Datos Personales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold">Nombre completo</label>
                <input
                  type="text"
                  value={formData.fullName || ""}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="font-semibold">Número de documento</label>
                <input
                  type="text"
                  value={formData.numDocument || ""}
                  onChange={(e) => handleChange("numDocument", e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="font-semibold">Teléfono</label>
                <input
                  type="text"
                  value={formData.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <label className="font-semibold">Correo electrónico</label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
            </div>
          </div>

          {/* ✅ Bloques dinámicos */}
          {program?.specificInformation?.secciones?.map((sec, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-lg font-bold mb-4">{sec.titulo}</h3>
                {sec.campos.map((campo) => renderField(campo))}
            </div>
            ))}


          {/* ✅ Checkbox términos */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              required
            />
            <span>
              Acepto los{" "}
              <a href="/terminos" className="text-blue-600 underline" target="_blank">
                Términos y Condiciones
              </a>
            </span>
          </div>

          {/* ✅ Botón */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Enviar inscripción
          </button>
        </form>
      </div>
    </div>
  );
}
