"use client";

export default function ProgramModal({ program, onClose, onOpenForm }) {
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold text-blue-800 mb-4">{program.name}</h2>
                <p className="text-gray-600 mb-4">{program.longDescription}</p>

                {program.requirements?.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-semibold text-gray-700">Requisitos:</h3>
                        <ul className="list-disc list-inside text-gray-600 text-sm">
                            {program.requirements.map((req, i) => <li key={i}>{req}</li>)}
                        </ul>
                    </div>
                )}

                {program.benefits?.length > 0 && (
                    <div>
                        <h3 className="font-semibold text-gray-700">Beneficios:</h3>
                        <ul className="list-disc list-inside text-gray-600 text-sm">
                            {program.benefits.map((ben, i) => <li key={i}>{ben}</li>)}
                        </ul>
                    </div>
                )}

                <button
                    onClick={() => onOpenForm(program)} // ✅ usar función pasada por prop
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                    Inscribirse
                </button>
            </div>
        </div>
    );
}