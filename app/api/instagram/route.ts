import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const response = await axios.get(
      "https://ciro-ecommerce-admin.vercel.app/api/posts"
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error en la API de Instagram:", error);
    return NextResponse.json(
      { error: "Error al obtener los posts de Instagram" },
      { status: 500 }
    );
  }
}
