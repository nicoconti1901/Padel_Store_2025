import { NextResponse } from "next/server"
import { getPaletas, getIndumentaria, getAccesorios } from "@/lib/api"

export async function GET(request: Request) {
  try {
    // Get the category from the URL query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let products = []

    switch (category) {
      case "paletas":
        products = await getPaletas()
        break
      case "indumentaria":
        products = await getIndumentaria()
        break
      case "accesorios":
        products = await getAccesorios()
        break
      default:
        return NextResponse.json(
          { error: "Categoría no válida" },
          { status: 400 }
        )
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    )
  }
}

