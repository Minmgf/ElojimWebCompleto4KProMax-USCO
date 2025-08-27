export default function ProgramsCard({ title, description, onClick }) {
  return (
    <div
      className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
      onClick={onClick}
    >
      <h2 className="text-xl font-bold text-blue-700 mb-2">{title}</h2>
      <p className="text-gray-600 mb-3">{description}</p>
    </div>
  );
}
