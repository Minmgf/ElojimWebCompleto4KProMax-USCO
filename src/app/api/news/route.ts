import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/libs/db';
import { createNewsSchema, newsQuerySchema, type CreateNewsInput, type NewsQueryInput } from '@/libs/zod';
import { uploadImage } from '@/libs/upload';

/**
 * GET /api/news - Obtener noticias con filtros y paginación
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validar parámetros de consulta
    const queryResult = newsQuerySchema.safeParse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      category: searchParams.get('category'),
      important: searchParams.get('important'),
      isActive: searchParams.get('isActive'),
      search: searchParams.get('search'),
    });

    if (!queryResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Parámetros de consulta inválidos',
          details: queryResult.error.issues 
        },
        { status: 400 }
      );
    }

    const { page, limit, category, important, isActive, search } = queryResult.data;

    // Construir filtros para Prisma
    const where: any = {};
    
    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    if (typeof important === 'boolean') {
      where.important = important;
    }

    if (category) {
      where.category = {
        has: category
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Calcular skip para paginación
    const skip = (page - 1) * limit;

    // Obtener noticias con paginación
    const [news, totalCount] = await Promise.all([
      db.news.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: [
          { important: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit,
      }),
      db.news.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        news,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
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
 * POST /api/news - Crear una nueva noticia (requiere autenticación)
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No autorizado. Debes iniciar sesión para crear noticias.' 
        },
        { status: 401 }
      );
    }

    // Obtener datos del formData para manejar archivos
    const formData = await request.formData();
    
    // Extraer datos del formulario
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const categoriesStr = formData.get('category') as string;
    const important = formData.get('important') === 'true';
    const isActive = formData.get('isActive') !== 'false'; // Por defecto true

    // Validar categorías
    let category: string[] = [];
    try {
      if (!categoriesStr) {
        category = [];
      } else {
        // Intentar parsear como JSON primero
        try {
          const parsed = JSON.parse(categoriesStr);
          if (Array.isArray(parsed)) {
            category = parsed;
          } else {
            throw new Error('Not an array');
          }
        } catch {
          // Si no es JSON válido, tratarlo como una sola categoría
          category = [categoriesStr];
        }
      }
    } catch {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Formato de categorías inválido.' 
        },
        { status: 400 }
      );
    }

    // Validar datos básicos
    const validationResult = createNewsSchema.safeParse({
      title,
      content,
      category,
      important,
      isActive
    });

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

    // Manejar subida de imágenes
    const images: string[] = [];
    const imageFiles = formData.getAll('images') as File[];
    
    if (imageFiles.length > 0) {
      // Validar número máximo de imágenes
      if (imageFiles.length > 5) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Máximo 5 imágenes permitidas por noticia' 
          },
          { status: 400 }
        );
      }

      // Subir cada imagen
      for (const file of imageFiles) {
        if (file.size > 0) { // Verificar que el archivo no esté vacío
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
            images.push(uploadResult.url);
          }
        }
      }
    }

    // Crear la noticia en la base de datos
    const newsData = validationResult.data;
    const newNews = await db.news.create({
      data: {
        ...newsData,
        images,
        authorId: session.user.id
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
      data: newNews,
      message: 'Noticia creada exitosamente'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}