import Link from "next/link"
import { FaAngleRight } from "react-icons/fa"

const NewsCard = ({ image, title, description, href, className = "" }) => {
    return (
        <Link
            href={href}
            className={`group relative block w-full max-w-md h-[280px] overflow-hidden rounded-lg border border-gray-300 bg-card transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${className}`}
        >
            <div className="relative h-full w-full">
                <img
                    src={image || "/placeholder.svg"}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="space-y-2">
                        <h3 className="text-base font-semibold leading-tight line-clamp-2 group-hover:text-white/90 transition-colors">
                            {title}
                        </h3>
                        <p className="text-sm text-white/80 line-clamp-2 leading-relaxed">{description}</p>
                    </div>

                    <div className="mt-3 flex items-center text-xs text-white/60 group-hover:text-white/80 transition-colors">
                        <span>Leer más</span>
                        <FaAngleRight />
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default NewsCard
