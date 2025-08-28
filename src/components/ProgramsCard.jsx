import { Heart, Lightbulb, Wrench, Leaf, GraduationCap, Code, Users, Music, DollarSign, Shield } from "lucide-react";

export default function ProgramsCard({ title, description, requirements, benefits, specificInformation, programId }) {
  // 🔹 Configuración de iconos y colores por programa
  const getProgramConfig = (id) => {
    const configs = {
      1: { // Programa Mujer vulnerable
        icon: Heart,
        iconColor: "text-pink-600",
        bgColor: "bg-pink-50",
        borderColor: "border-pink-200",
        titleColor: "text-pink-700",
        buttonColor: "bg-pink-600 hover:bg-pink-700"
      },
      2: { // Semillero de Innovación y Emprendimiento
        icon: Lightbulb,
        iconColor: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        titleColor: "text-green-700",
        buttonColor: "bg-green-600 hover:bg-green-700"
      },
      3: { // Programa Taller STEAM+H
        icon: Wrench,
        iconColor: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        titleColor: "text-orange-700",
        buttonColor: "bg-orange-600 hover:bg-orange-700"
      },
      4: { // Programa de Jornadas de Refuerzo Escolar
        icon: GraduationCap,
        iconColor: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        titleColor: "text-yellow-700",
        buttonColor: "bg-yellow-600 hover:bg-yellow-700"
      },
      5: { // Programa de Factoría de Software
        icon: Code,
        iconColor: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        titleColor: "text-blue-700",
        buttonColor: "bg-blue-600 hover:bg-blue-700"
      },
      6: { // Programa de Voluntariado Social
        icon: Users,
        iconColor: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        titleColor: "text-red-700",
        buttonColor: "bg-red-600 hover:bg-red-700"
      },
      7: { // Programa Economía Plateada
        icon: DollarSign,
        iconColor: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        titleColor: "text-gray-700",
        buttonColor: "bg-gray-600 hover:bg-gray-700"
      },
      8: { // Programa Cultural
        icon: Music,
        iconColor: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        titleColor: "text-purple-700",
        buttonColor: "bg-purple-600 hover:bg-purple-700"
      },
      9: { // Programa de Seguridad Alimentaria
        icon: Leaf,
        iconColor: "text-teal-600",
        bgColor: "bg-teal-50",
        borderColor: "border-teal-200",
        titleColor: "text-teal-700",
        buttonColor: "bg-teal-600 hover:bg-teal-700"
      }
    };
    
    return configs[id] || {
      icon: Shield,
      iconColor: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      titleColor: "text-gray-700",
      buttonColor: "bg-gray-600 hover:bg-gray-700"
    };
  };

  const config = getProgramConfig(programId);
  const IconComponent = config.icon;

  return (
    <div className={`h-[500px] p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${config.borderColor} hover:scale-105 flex flex-col group-hover:border-opacity-80`}>
      {/* 🔹 Header con icono y título */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-3 rounded-full ${config.bgColor} group-hover:scale-110 transition-transform duration-200`}>
          <IconComponent className={`h-6 w-6 ${config.iconColor}`} />
        </div>
        <h2 className={`text-xl font-bold ${config.titleColor} flex-1 leading-tight`}>
          {title}
        </h2>
      </div>

      {/* 🔹 Descripción */}
      <p className="text-gray-600 mb-4 text-sm leading-relaxed flex-shrink-0">
        {description}
      </p>

      {/* 🔹 Contenido scrollable */}
      <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {/* Requisitos */}
        {requirements?.length > 0 && (
          <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <h3 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Requisitos
            </h3>
            <ul className="space-y-1">
              {requirements.slice(0, 3).map((req, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="leading-tight">{req}</span>
                </li>
              ))}
              {requirements.length > 3 && (
                <li className="text-xs text-gray-500 italic">
                  +{requirements.length - 3} requisitos más...
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Beneficios */}
        {benefits?.length > 0 && (
          <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <h3 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Beneficios
            </h3>
            <ul className="space-y-1">
              {benefits.slice(0, 3).map((ben, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span className="leading-tight">{ben}</span>
                </li>
              ))}
              {benefits.length > 3 && (
                <li className="text-xs text-gray-500 italic">
                  +{benefits.length - 3} beneficios más...
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* 🔹 Botón de inscripción */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex-shrink-0">
        <button className={`w-full text-white py-3 px-4 rounded-lg transition-all duration-200 font-semibold ${config.buttonColor} flex items-center justify-center gap-2 group-hover:shadow-lg transform group-hover:-translate-y-0.5`}>
          <IconComponent className="h-4 w-4" />
          Inscribirse
        </button>
      </div>
    </div>
  );
}
