'use client'

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useCreateNews, useUpdateNews } from "@/hooks/useNews";
import { useState, useEffect } from "react";
import { toast } from "sonner";


const NewsModal = ({ trigger, onSuccess, editData, isEdit = false, isOpen: externalIsOpen, onOpenChange: externalOnOpenChange }) => {
	const { createNews, loading: createLoading, error: createError } = useCreateNews();
	const { updateNews, loading: updateLoading, error: updateError } = useUpdateNews();
	const [internalIsOpen, setInternalIsOpen] = useState(false);
	const [formData, setFormData] = useState({
		title: '',
		content: '',
		category: [],
		important: false,
		isActive: true
	});
	const [images, setImages] = useState([]);
	const [existingImages, setExistingImages] = useState([]);
	const [imagesToDelete, setImagesToDelete] = useState([]);

	const loading = createLoading || updateLoading;
	const error = createError || updateError;

	// Control del estado del modal (externo o interno)
	const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
	const setIsOpen = externalOnOpenChange !== undefined ? externalOnOpenChange : setInternalIsOpen;

	const categories = [
		'general', 'educacion', 'salud', 'deportes', 'cultura', 'tecnologia'
	];

	// Cargar datos para edición
	useEffect(() => {
		if (isEdit && editData) {
			setFormData({
				title: editData.title || '',
				content: editData.content || '',
				category: editData.category || [],
				important: editData.important || false,
				isActive: editData.isActive !== undefined ? editData.isActive : true
			});
			// Cargar imágenes existentes
			setExistingImages(editData.images || []);
			setImages([]);
			setImagesToDelete([]);
		}
	}, [isEdit, editData]);

	const resetForm = () => {
		setFormData({
			title: '',
			content: '',
			category: [],
			important: false,
			isActive: true
		});
		setImages([]);
		setExistingImages([]);
		setImagesToDelete([]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!formData.title.trim() || !formData.content.trim()) {
			toast.error('Por favor completa todos los campos requeridos');
			return;
		}

		try {
			let result;
			if (isEdit && editData?.id) {
				const updateData = {
					...formData,
					newImages: images,
					deleteImages: imagesToDelete
				};
				result = await updateNews(editData.id, updateData);
				if (result) {
					toast.success('Noticia actualizada exitosamente');
				}
			} else {
				const newsData = {
					...formData,
					images: images
				};
				result = await createNews(newsData);
				if (result) {
					toast.success('Noticia creada exitosamente');
				}
			}
			
			if (result) {
				setIsOpen(false);
				resetForm();
				onSuccess?.(result);
			} else if (error) {
				toast.error(error);
			}
		} catch (err) {
			console.error('Error al guardar noticia:', err);
			toast.error(`Error al ${isEdit ? 'actualizar' : 'crear'} la noticia. Inténtalo de nuevo.`);
		}
	};

	const handleImageChange = (e) => {
		const files = Array.from(e.target.files);
		const totalImages = existingImages.length - imagesToDelete.length + images.length + files.length;
		
		if (totalImages > 5) {
			toast.error('Máximo 5 imágenes permitidas');
			return;
		}
		setImages(prev => [...prev, ...files]);
	};

	const removeNewImage = (index) => {
		setImages(prev => prev.filter((_, i) => i !== index));
	};

	const removeExistingImage = (imageUrl) => {
		setImagesToDelete(prev => [...prev, imageUrl]);
	};

	const restoreExistingImage = (imageUrl) => {
		setImagesToDelete(prev => prev.filter(url => url !== imageUrl));
	};

	const toggleCategory = (cat) => {
		setFormData(prev => ({
			...prev,
			category: prev.category.includes(cat)
				? prev.category.filter(c => c !== cat)
				: [...prev.category, cat]
		}));
	};

	return (
		<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
			<Dialog.Trigger asChild>
				{trigger || (
					<button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
						Crear Noticia
					</button>
				)}
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
				<Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
					<div className="p-6">
						<Dialog.Title className="text-xl font-bold mb-4">
							{isEdit ? 'Editar Noticia' : 'Crear Nueva Noticia'}
						</Dialog.Title>
						
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
								{error}
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">
							{/* Título */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Título *
								</label>
								<input
									type="text"
									value={formData.title}
									onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									placeholder="Título de la noticia"
									required
								/>
							</div>

							{/* Contenido */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Contenido *
								</label>
								<textarea
									value={formData.content}
									onChange={(e) => setFormData(prev => ({...prev, content: e.target.value}))}
									rows={6}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									placeholder="Contenido de la noticia"
									required
								/>
							</div>

							{/* Categorías */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Categorías
								</label>
								<div className="flex flex-wrap gap-2">
									{categories.map(cat => (
										<button
											key={cat}
											type="button"
											onClick={() => toggleCategory(cat)}
											className={`px-3 py-1 rounded-full text-sm transition-colors ${
												formData.category.includes(cat)
													? 'bg-blue-500 text-white'
													: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
											}`}
										>
											{cat}
										</button>
									))}
								</div>
							</div>

							{/* Imágenes */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Imágenes (máximo 5)
								</label>
								<input
									type="file"
									multiple
									accept="image/*"
									onChange={handleImageChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg"
								/>
								
								{/* Imágenes existentes */}
								{isEdit && existingImages.length > 0 && (
									<div className="mt-3">
										<h4 className="text-sm font-medium text-gray-700 mb-2">Imágenes actuales:</h4>
										<div className="flex flex-wrap gap-2">
											{existingImages.map((imageUrl, index) => (
												<div key={`existing-${index}`} className="relative">
													<img
														src={imageUrl}
														alt={`Existing ${index}`}
														className={`w-20 h-20 object-cover rounded border ${
															imagesToDelete.includes(imageUrl) ? 'opacity-50 grayscale' : ''
														}`}
													/>
													{imagesToDelete.includes(imageUrl) ? (
														<button
															type="button"
															onClick={() => restoreExistingImage(imageUrl)}
															className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
															title="Restaurar imagen"
														>
															↶
														</button>
													) : (
														<button
															type="button"
															onClick={() => removeExistingImage(imageUrl)}
															className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
															title="Marcar para eliminar"
														>
															×
														</button>
													)}
												</div>
											))}
										</div>
									</div>
								)}
								
								{/* Nuevas imágenes */}
								{images.length > 0 && (
									<div className="mt-3">
										<h4 className="text-sm font-medium text-gray-700 mb-2">
											{isEdit ? 'Nuevas imágenes:' : 'Imágenes seleccionadas:'}
										</h4>
										<div className="flex flex-wrap gap-2">
											{images.map((file, index) => (
												<div key={`new-${index}`} className="relative">
													<img
														src={URL.createObjectURL(file)}
														alt={`Preview ${index}`}
														className="w-20 h-20 object-cover rounded border"
													/>
													<button
														type="button"
														onClick={() => removeNewImage(index)}
														className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
													>
														×
													</button>
												</div>
											))}
										</div>
									</div>
								)}
							</div>

							{/* Opciones */}
							<div className="flex gap-4">
								<label className="flex items-center">
									<input
										type="checkbox"
										checked={formData.important}
										onChange={(e) => setFormData(prev => ({...prev, important: e.target.checked}))}
										className="mr-2"
									/>
									Noticia importante
								</label>
								<label className="flex items-center">
									<input
										type="checkbox"
										checked={formData.isActive}
										onChange={(e) => setFormData(prev => ({...prev, isActive: e.target.checked}))}
										className="mr-2"
									/>
									Publicar inmediatamente
								</label>
							</div>

							{/* Botones */}
							<div className="flex justify-end gap-3 pt-4">
								<Dialog.Close asChild>
									<button
										type="button"
										className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
									>
										Cancelar
									</button>
								</Dialog.Close>
								<button
									type="submit"
									disabled={loading}
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{loading ? (isEdit ? 'Actualizando...' : 'Creando...') : (isEdit ? 'Actualizar Noticia' : 'Crear Noticia')}
								</button>
							</div>
						</form>
					</div>

					<Dialog.Close asChild>
						<button 
							className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
							aria-label="Cerrar"
						>
							<Cross2Icon />
						</button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default NewsModal;
