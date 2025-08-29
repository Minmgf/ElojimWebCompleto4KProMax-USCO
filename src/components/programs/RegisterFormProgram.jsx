"use client";

import { useState } from "react";
import { 
    TYPE_DOCUMENT_OPTIONS,
    GENDER_OPTIONS,
    SOCIAL_STRATUM_OPTIONS,
    ETNICAL_GROUP_OPTIONS,
    DEFAULT_FORM_VALUES 
} from "@/constants/enums";

export default function ProgramFormModal({ program, onClose, onOpenForm }) {
    const [formData, setFormData] = useState({
        typeDocument: DEFAULT_FORM_VALUES.typeDocument,
        gender: DEFAULT_FORM_VALUES.gender,
        numDocument: "",
        fullName: "",
        birthDate: "",
        comune: "",
        socialStratum: DEFAULT_FORM_VALUES.socialStratum,
        age: "",
        etnicalGroup: DEFAULT_FORM_VALUES.etnicalGroup,
        address: "",
        phone: "",
        email: "",
        motivation: "",
        expectations: "",
        acceptTerms: false,
        specificInformation: {},
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/programas/registro-programas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    programaId: program.id,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Inscripción realizada con éxito");
                onClose();
            } else {
                setError(data.error || "Error al registrar");
            }
        } catch (err) {
            setError("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg relative overflow-y-auto max-h-screen">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold text-blue-800 mb-4">
                    Inscripción: {program.name}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo de documento</label>
                            <select
                                name="typeDocument"
                                value={formData.typeDocument}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                {TYPE_DOCUMENT_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Género</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                {GENDER_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <input
                        type="text"
                        name="numDocument"
                        placeholder="Número de documento"
                        value={formData.numDocument}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />

                    <input
                        type="text"
                        name="fullName"
                        placeholder="Nombre completo"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />

                    <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />

                    <input
                        type="text"
                        name="comune"
                        placeholder="Comuna"
                        value={formData.comune}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Estrato social</label>
                        <select
                            name="socialStratum"
                            value={formData.socialStratum}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Seleccionar estrato</option>
                            {SOCIAL_STRATUM_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <input
                        type="number"
                        name="age"
                        placeholder="Edad"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Grupo étnico</label>
                        <select
                            name="etnicalGroup"
                            value={formData.etnicalGroup}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        >
                            {ETNICAL_GROUP_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <input
                        type="text"
                        name="address"
                        placeholder="Dirección"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />

                    <input
                        type="tel"
                        name="phone"
                        placeholder="Teléfono"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />

                    <textarea
                        name="motivation"
                        placeholder="Motivación"
                        value={formData.motivation}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />

                    <textarea
                        name="expectations"
                        placeholder="Expectativas"
                        value={formData.expectations}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />

                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="acceptTerms"
                            checked={formData.acceptTerms}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        Acepto los términos y condiciones
                    </label>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                    >
                        {loading ? "Enviando..." : "Registrarse"}
                    </button>
                </form>
            </div>
        </div>
    );
}
