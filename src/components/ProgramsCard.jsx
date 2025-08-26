export default function ProgramsCard({ title, description, requirements, benefits, specificInformation }) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
      <h2 className="text-xl font-bold text-blue-700 mb-2">{title}</h2>
      <p className="text-gray-600 mb-3">{description}</p>

      {requirements?.length > 0 && (
        <div className="mb-2">
          <h3 className="font-semibold text-sm">Requisitos:</h3>
          <ul className="list-disc list-inside text-sm text-gray-500">
            {requirements.map((req, i) => <li key={i}>{req}</li>)}
          </ul>
        </div>
      )}

      {benefits?.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm">Beneficios:</h3>
          <ul className="list-disc list-inside text-sm text-gray-500">
            {benefits.map((ben, i) => <li key={i}>{ben}</li>)}
          </ul>
        </div>
      )}

      {specificInformation && Object.keys(specificInformation).length > 0 && (
        <div className="mt-6">
            <h3 className="font-semibold text-base mb-4 text-gray-800">Formulario del programa</h3>
            <div className="space-y-4">
            {Object.entries(specificInformation).map(([key, value], i) => (
                <div key={i} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">{key}</label>
                <input
                    type="text"
                    value={value || ""}
                    readOnly
                    className="mt-1 p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                    placeholder="No especificado"
                />
                </div>
            ))}
            </div>
        </div>
        )}
    </div>
  );
}
