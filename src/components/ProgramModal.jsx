"use client";
import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { FaUser } from "react-icons/fa";

export default function ProgramModal({ program, onClose, isOpen }) {
  const [formData, setFormData] = useState({
    typeDocument: "CC",
    gender: "MASCULINO",
    numDocument: "",
    fullName: "",
    birthDate: "",
    comune: "Comuna 1",
    socialStratum: "E1",
    age: "",
    etnicalGroup: "Ninguno",
    address: "",
    phone: "",
    email: "",
    motivation: "",
    expectations: "",
    acceptTerms: false,
    specificInformation: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Obtener información específica del programa
  const [programDetails, setProgramDetails] = useState(null);

  useEffect(() => {
    if (program?.id && isOpen) {
      fetchProgramDetails(program.id);
    }
  }, [program, isOpen]);

  const fetchProgramDetails = async (programId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/programas/gestion-programas/${programId}`);
      if (!res.ok) throw new Error("Error fetching program details");
      const data = await res.json();
      setProgramDetails(data);
      
      // 🔹 Inicializar specificInformation con campos vacíos
      const initialSpecificInfo = {};
      if (data.specificInformation?.secciones) {
        data.specificInformation.secciones.forEach(seccion => {
          seccion.campos.forEach(campo => {
            if (campo.tipo === "checkbox") {
              initialSpecificInfo[campo.nombre] = [];
            } else {
              initialSpecificInfo[campo.nombre] = "";
            }
          });
        });
      }
      setFormData(prev => ({
        ...prev,
        specificInformation: initialSpecificInfo
      }));
    } catch (err) {
      console.error("Error cargando detalles del programa:", err);
      setError("Error cargando información del programa");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecificInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      specificInformation: {
        ...prev.specificInformation,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      alert("Debes aceptar los términos y condiciones");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        programaId: program.id
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
        const errorData = await res.json();
        setError(errorData.error || "Error al enviar la inscripción");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Función inteligente para decidir el tipo de campo
  const getFieldType = (campo) => {
    // Si es checkbox explícito, mantenerlo
    if (campo.tipo === "checkbox") return "checkbox";
    
    // Si tiene muchas opciones (>4), usar select para evitar desbordamiento
    if (campo.opciones && campo.opciones.length > 4) return "select";
    
    // Si tiene pocas opciones (≤4), usar radio para mejor UX
    if (campo.opciones && campo.opciones.length <= 4) return "radio";
    
    // Por defecto, usar el tipo especificado
    return campo.tipo;
  };

  const renderField = (campo) => {
    // 🔹 Verificar condiciones
    if (campo.condiciones && campo.condiciones.length > 0) {
      const cumple = campo.condiciones.every((cond) => {
        const valorCampo = formData.specificInformation[cond.campo];
        return valorCampo === cond.valor;
      });
      if (!cumple) return null;
    }

    const fieldType = getFieldType(campo);
    const commonClasses = "border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white";

    switch (fieldType) {
      case "text":
      case "email":
      case "number":
      case "date":
        return (
          <div key={campo.nombre} className="flex flex-col mb-6">
            <label className="font-semibold text-gray-700 mb-3 text-sm">
              {campo.etiqueta}
              {campo.obligatorio && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={campo.tipo}
              value={formData.specificInformation[campo.nombre] || ""}
              onChange={(e) => handleSpecificInfoChange(campo.nombre, e.target.value)}
              className={commonClasses}
              required={campo.obligatorio || false}
              placeholder={`Ingrese ${campo.etiqueta.toLowerCase()}`}
            />
          </div>
        );

      case "radio":
        return (
          <div key={campo.nombre} className="flex flex-col mb-6">
            <label className="font-semibold text-gray-700 mb-3 text-sm">
              {campo.etiqueta}
              {campo.obligatorio && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {campo.opciones.map((op) => (
                <label key={op} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                  <input
                    type="radio"
                    name={campo.nombre}
                    value={op}
                    checked={formData.specificInformation[campo.nombre] === op}
                    onChange={() => handleSpecificInfoChange(campo.nombre, op)}
                    required={campo.obligatorio || false}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 text-sm font-medium">{op}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case "select":
        return (
          <div key={campo.nombre} className="flex flex-col mb-6">
            <label className="font-semibold text-gray-700 mb-3 text-sm">
              {campo.etiqueta}
              {campo.obligatorio && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={formData.specificInformation[campo.nombre] || ""}
              onChange={(e) => handleSpecificInfoChange(campo.nombre, e.target.value)}
              className={`${commonClasses} cursor-pointer`}
              required={campo.obligatorio || false}
            >
              <option value="">Seleccione una opción...</option>
              {campo.opciones.map((op, idx) => (
                <option key={idx} value={op} className="py-2">{op}</option>
              ))}
            </select>
          </div>
        );

      case "checkbox":
        return (
          <div key={campo.nombre} className="flex flex-col mb-6">
            <label className="font-semibold text-gray-700 mb-3 text-sm">
              {campo.etiqueta}
              {campo.obligatorio && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {campo.opciones.map((op) => (
                <label key={op} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                  <input
                    type="checkbox"
                    checked={formData.specificInformation[campo.nombre]?.includes(op) || false}
                    onChange={(e) => {
                      const currentValues = formData.specificInformation[campo.nombre] || [];
                      if (e.target.checked) {
                        handleSpecificInfoChange(campo.nombre, [...currentValues, op]);
                      } else {
                        handleSpecificInfoChange(campo.nombre, currentValues.filter(v => v !== op));
                      }
                    }}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-gray-700 text-sm font-medium">{op}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case "textarea":
        return (
          <div key={campo.nombre} className="flex flex-col mb-6">
            <label className="font-semibold text-gray-700 mb-3 text-sm">
              {campo.etiqueta}
              {campo.obligatorio && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={formData.specificInformation[campo.nombre] || ""}
              onChange={(e) => handleSpecificInfoChange(campo.nombre, e.target.value)}
              className={`${commonClasses} min-h-[120px] resize-vertical`}
              required={campo.obligatorio || false}
              placeholder={`Describa ${campo.etiqueta.toLowerCase()}`}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto flex flex-col">
            {/* 🔹 Header del modal */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 md:p-8 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Dialog.Title className="text-2xl md:text-3xl font-bold mb-2">
                    {program?.name}
                  </Dialog.Title>
                  <Dialog.Description className="text-sm md:text-base opacity-90">
                    {program?.description}
                  </Dialog.Description>
                  {program?.longDescription && (
                    <p className="text-blue-50 text-sm leading-relaxed">
                      {program.longDescription}
                    </p>
                  )}
                </div>
                <Dialog.Close asChild>
                  <button className="text-white hover:text-blue-100 transition-colors p-2 hover:bg-white/10 rounded-full">
                    <Cross2Icon className="h-6 w-6" />
                  </button>
                </Dialog.Close>
              </div>
            </div>

            {/* 🔹 Contenido del modal */}
            <div className="p-6 md:p-8">
              {loading && !programDetails ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
                  <p className="text-gray-600 text-lg">Cargando información del programa...</p>
                </div>
              ) : (
                /* 🔹 Formulario de inscripción */
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* ✅ Bloque fijo: Datos personales */}
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl border border-gray-200">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm"><FaUser /></span>
                      </div>
                      Datos Personales
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="font-semibold text-gray-700 mb-2 block">Tipo de documento</label>
                        <select
                          value={formData.typeDocument}
                          onChange={(e) => handleChange("typeDocument", e.target.value)}
                          className="border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          required
                        >
                          <option value="CC">Cédula de Ciudadanía</option>
                          <option value="TI">Tarjeta de Identidad</option>
                          <option value="CE">Cédula de Extranjería</option>
                          <option value="PP">Pasaporte</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 mb-2 block">Género</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => handleChange("gender", e.target.value)}
                          className="border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          required
                        >
                          <option value="MASCULINO">Masculino</option>
                          <option value="FEMENINO">Femenino</option>
                          <option value="OTRO">Otro</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 mb-2 block">Número de documento *</label>
                        <input
                          type="text"
                          value={formData.numDocument}
                          onChange={(e) => handleChange("numDocument", e.target.value)}
                          className="border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          required
                          placeholder="Ingrese su número de documento"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 mb-2 block">Nombre completo *</label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => handleChange("fullName", e.target.value)}
                          className="border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          required
                          placeholder="Ingrese su nombre completo"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 mb-2 block">Fecha de nacimiento</label>
                        <input
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) => handleChange("birthDate", e.target.value)}
                          className="border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 mb-2 block">Comuna</label>
                        <select
                          value={formData.comune}
                          onChange={(e) => handleChange("comune", e.target.value)}
                          className="border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                          <option value="Comuna 1">Comuna 1</option>
                          <option value="Comuna 2">Comuna 2</option>
                          <option value="Comuna 3">Comuna 3</option>
                          <option value="Comuna 4">Comuna 4</option>
                          <option value="Comuna 5">Comuna 5</option>
                          <option value="Comuna 6">Comuna 6</option>
                          <option value="Comuna 7">Comuna 7</option>
                          <option value="Comuna 8">Comuna 8</option>
                          <option value="Comuna 9">Comuna 9</option>
                          <option value="Comuna 10">Comuna 10</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 mb-2 block">Estrato socioeconómico</label>
                        <select
                          value={formData.socialStratum}
                          onChange={(e) => handleChange("socialStratum", e.target.value)}
                          className="border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                          <option value="E1">E1</option>
                          <option value="E2">E2</option>
                          <option value="E3">E3</option>
                          <option value="E4">E4</option>
                          <option value="E5">E5</option>
                          <option value="E6">E6</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 mb-2 block">Edad</label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) => handleChange("age", e.target.value)}
                          className="border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          min="0"
                          max="120"
                          placeholder="Ingrese su edad"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 mb-2 block">Grupo étnico</label>
                        <select
                          value={formData.etnicalGroup}
                          onChange={(e) => handleChange("etnicalGroup", e.target.value)}
                          className="border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                          <option value="Ninguno">Ninguno</option>
                          <option value="Indígena">Indígena</option>
                          <option value="Afrocolombiano">Afrocolombiano</option>
                          <option value="Raizal">Raizal</option>
                          <option value="Palenquero">Palenquero</option>
                          <option value="Gitano">Gitano</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="font-semibold text-gray-700 mb-2 block">Dirección</label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => handleChange("address", e.target.value)}
                          className="border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Ingrese su dirección completa"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 mb-2 block">Teléfono</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          className="border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Ingrese su teléfono"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 mb-2 block">Correo electrónico</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          className="border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Ingrese su correo electrónico"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="font-semibold text-gray-700 mb-2 block">Motivación para participar</label>
                        <textarea
                          value={formData.motivation}
                          onChange={(e) => handleChange("motivation", e.target.value)}
                          className="border rounded-lg px-4 py-3 w-full min-h-[100px] resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="¿Por qué desea participar en este programa?"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="font-semibold text-gray-700 mb-2 block">Expectativas del programa</label>
                        <textarea
                          value={formData.expectations}
                          onChange={(e) => handleChange("expectations", e.target.value)}
                          className="border rounded-lg px-4 py-3 w-full min-h-[100px] resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="¿Qué espera lograr con su participación?"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ✅ Bloques dinámicos del programa específico */}
                  {programDetails?.specificInformation?.secciones?.map((sec, i) => (
                    <div key={i} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
                      <h3 className="text-2xl font-bold mb-6 text-blue-800 flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{i + 1}</span>
                        </div>
                        {sec.titulo}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sec.campos.map((campo) => renderField(campo))}
                      </div>
                    </div>
                  ))}

                  {/* ✅ Checkbox términos */}
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={formData.acceptTerms}
                        onChange={(e) => handleChange("acceptTerms", e.target.checked)}
                        className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        required
                      />
                      <div className="text-gray-700">
                        <p className="font-semibold mb-2">Términos y Condiciones</p>
                        <p className="text-sm leading-relaxed">
                          Acepto los{" "}
                          <a href="/terminos" className="text-blue-600 underline hover:text-blue-800 font-medium" target="_blank" rel="noopener noreferrer">
                            Términos y Condiciones
                          </a>{" "}
                          del programa y autorizo el tratamiento de mis datos personales según la política de privacidad.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ✅ Mensaje de error */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">!</span>
                        </div>
                        <span className="font-medium">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* ✅ Botón enviar */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 px-8 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        Enviando inscripción...
                      </div>
                    ) : (
                      "📝 Enviar Inscripción"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
