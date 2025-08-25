import { supabaseServer } from './supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Sube una imagen a Supabase Storage
 * @param file - El archivo a subir
 * @param bucket - El bucket donde subir el archivo (por defecto 'news-images')
 * @param folder - La carpeta dentro del bucket (por defecto 'uploads')
 * @returns Promise<UploadResult>
 */
export async function uploadImage(
  file: File,
  bucket: string = 'news-images',
  folder: string = 'uploads'
): Promise<UploadResult> {
  try {
    // Validar el tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, WebP)'
      };
    }

    // Validar el tamaño del archivo (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'El archivo es demasiado grande. Tamaño máximo: 5MB'
      };
    }

    // Generar un nombre único para el archivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;
    const filePath = `${folder}/${fileName}`;

    // Subir el archivo a Supabase
    const { data, error } = await supabaseServer.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file to Supabase:', error);
      return {
        success: false,
        error: 'Error al subir la imagen'
      };
    }

    // Obtener la URL pública del archivo
    const { data: publicUrlData } = supabaseServer.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrlData.publicUrl
    };

  } catch (error) {
    console.error('Unexpected error uploading file:', error);
    return {
      success: false,
      error: 'Error inesperado al subir la imagen'
    };
  }
}

/**
 * Elimina una imagen de Supabase Storage
 * @param imageUrl - La URL de la imagen a eliminar
 * @param bucket - El bucket donde está la imagen
 * @returns Promise<boolean>
 */
export async function deleteImage(
  imageUrl: string,
  bucket: string = 'news-images'
): Promise<boolean> {
  try {
    // Extraer el path del archivo de la URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf(bucket) + 1).join('/');

    const { error } = await supabaseServer.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file from Supabase:', error);
      return false;
    }

    return true;

  } catch (error) {
    console.error('Unexpected error deleting file:', error);
    return false;
  }
}
