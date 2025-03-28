import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://ciro-ecommerce-admin.vercel.app/api/posts', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los posts de Instagram');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en la API de Instagram:', error);
    return NextResponse.json(
      { error: 'Error al obtener los posts de Instagram' },
      { status: 500 }
    );
  }
} 