import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/libs/db';
import { updateNewsSchema, type UpdateNewsInput } from '@/libs/zod';
import { uploadImage, deleteImage } from '@/libs/upload';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/news/[id] - Obtener una noticia específica
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de noticia requerido' 
        },
        { status: 400 }
      );
    }

    const news = await db.news.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!news) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Noticia no encontrada' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: news
    });

  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/news/[id] - Actualizar una noticia (requiere autenticación)
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No autorizado. Debes iniciar sesión para actualizar noticias.' 
        },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de noticia requerido' 
        },
        { status: 400 }
      );
    }

    // Verificar que la noticia existe
    const existingNews = await db.news.findUnique({
      where: { id }
    });

    if (!existingNews) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Noticia no encontrada' 
        },
        { status: 404 }
      );
    }

    // Verificar que el usuario es el autor de la noticia
    if (existingNews.authorId !== session.user.id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No tienes permisos para actualizar esta noticia' 
        },
        { status: 403 }
      );
    }

    // Obtener datos del formData para manejar archivos
    const formData = await request.formData();
    
    // Extraer datos del formulario
    const updateData: any = {};
    
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const categoriesStr = formData.get('category') as string;
    const important = formData.get('important');
    const isActive = formData.get('isActive');

    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (important !== null) updateData.important = important === 'true';
    if (isActive !== null) updateData.isActive = isActive === 'true';

    // Manejar categorías si se proporcionan
    if (categoriesStr) {
      try {
        const category = JSON.parse(categoriesStr);
        if (Array.isArray(category)) {
          updateData.category = category;
        }
      } catch {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Formato de categorías inválido. Debe ser un array JSON.' 
          },
          { status: 400 }
        );
      }
    }

    // Validar datos si hay alguno para actualizar
    if (Object.keys(updateData).length === 0) {
      // Verificar si hay imágenes para agregar
      const newImageFiles = formData.getAll('newImages') as File[];
      const imagesToDelete = formData.getAll('deleteImages') as string[];
      
      if (newImageFiles.length === 0 && imagesToDelete.length === 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No se proporcionaron datos para actualizar' 
          },
          { status: 400 }
        );
      }
    }

    if (Object.keys(updateData).length > 0) {
      const validationResult = updateNewsSchema.safeParse(updateData);

      if (!validationResult.success) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Datos inválidos',
            details: validationResult.error.issues 
          },
          { status: 400 }
        );
      }
    }

    // Manejar imágenes
    let updatedImages = [...existingNews.images];

    // Eliminar imágenes marcadas para eliminación
    const imagesToDelete = formData.getAll('deleteImages') as string[];
    if (imagesToDelete.length > 0) {
      for (const imageUrl of imagesToDelete) {
        // Eliminar de Supabase
        await deleteImage(imageUrl);
        // Eliminar de la lista
        updatedImages = updatedImages.filter(img => img !== imageUrl);
      }
    }

    // Agregar nuevas imágenes
    const newImageFiles = formData.getAll('newImages') as File[];
    if (newImageFiles.length > 0) {
      // Validar número total de imágenes
      if (updatedImages.length + newImageFiles.length > 5) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Máximo 5 imágenes permitidas por noticia' 
          },
          { status: 400 }
        );
      }

      for (const file of newImageFiles) {
        if (file.size > 0) {
          const uploadResult = await uploadImage(file);
          
          if (!uploadResult.success) {
            return NextResponse.json(
              { 
                success: false, 
                error: `Error subiendo imagen: ${uploadResult.error}` 
              },
              { status: 400 }
            );
          }
          
          if (uploadResult.url) {
            updatedImages.push(uploadResult.url);
          }
        }
      }
    }

    // Actualizar en la base de datos
    const updatedNews = await db.news.update({
      where: { id },
      data: {
        ...updateData,
        images: updatedImages,
        updatedAt: new Date()
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedNews,
      message: 'Noticia actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/news/[id] - Eliminar una noticia (requiere autenticación)
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No autorizado. Debes iniciar sesión para eliminar noticias.' 
        },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de noticia requerido' 
        },
        { status: 400 }
      );
    }

    // Verificar que la noticia existe
    const existingNews = await db.news.findUnique({
      where: { id }
    });

    if (!existingNews) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Noticia no encontrada' 
        },
        { status: 404 }
      );
    }

    // Verificar que el usuario es el autor de la noticia
    if (existingNews.authorId !== session.user.id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No tienes permisos para eliminar esta noticia' 
        },
        { status: 403 }
      );
    }

    // Eliminar todas las imágenes de Supabase
    if (existingNews.images.length > 0) {
      for (const imageUrl of existingNews.images) {
        await deleteImage(imageUrl);
      }
    }

    // Eliminar la noticia de la base de datos
    await db.news.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Noticia eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}
