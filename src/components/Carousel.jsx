import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Carousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState(null);

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const goToPrevious = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + images.length) % images.length
        );
    };

    const openModal = (image) => {
        setModalImage(image);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalImage(null);
    };

    return (
        <div className="w-full relative overflow-hidden rounded-lg shadow-md bg-black">
            {/* Imagen central */}
            <div className="flex justify-center items-center">
                <img
                    src={images[currentIndex]}
                    alt={`Imagen ${currentIndex + 1}`}
                    className="w-full h-[450px] object-cover transition-transform duration-500 ease-in-out cursor-pointer"
                    onClick={() => openModal(images[currentIndex])}
                    data-testid="current-image"
                />
            </div>

            {/* Botón para navegar hacia atrás */}
            <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-sm rounded-xl"
                data-testid="previous-button"
            >
                <IoIosArrowBack size={35} className="text-white flex items-center justify-center font-bold" />
            </button>

            {/* Botón para navegar hacia adelante */}
            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-sm rounded-xl"
                data-testid="next-button"
            >
                <IoIosArrowForward size={35} className="text-white flex items-center justify-center font-extrabold" />
            </button>

            {/* Indicadores tipo puntos */}
            {/* Indicadores tipo puntos */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        className={`w-3 h-3 rounded-full border border-gray-300 transition-all ${currentIndex === idx
                                ? "bg-blue-500 scale-110 shadow-md" 
                                : "bg-gray-300 hover:bg-gray-400"  
                            }`}
                        onClick={() => setCurrentIndex(idx)}
                    />
                ))}
            </div>


            {/* Modal para la vista ampliada de la imagen */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50">
                    <div className="relative">
                        <img
                            src={modalImage}
                            alt="Imagen ampliada"
                            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
                            data-testid="modal-image"
                        />
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-white text-3xl bg-black/50 p-2 rounded-full hover:bg-black/70 transition duration-300"
                            data-testid="close-modal-button"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Carousel;
