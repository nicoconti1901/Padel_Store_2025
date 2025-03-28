import { getPaletaById, getIndumentariaById, getAccesorioById } from "@/lib/db"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Star } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface ProductDetailPageProps {
  params: {
    categoria: string
    id: string
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { categoria, id } = params

  let product

  // Fetch product based on category
  if (categoria === "paletas") {
    const result = await getPaletaById(id)
    product = Array.isArray(result) && result.length > 0 ? result[0] : null
  } else if (categoria === "indumentaria") {
    const result = await getIndumentariaById(id)
    product = Array.isArray(result) && result.length > 0 ? result[0] : null
  } else if (categoria === "accesorios") {
    const result = await getAccesorioById(id)
    product = Array.isArray(result) && result.length > 0 ? result[0] : null
  }

  // If product not found, return 404
  if (!product) {
    notFound()
  }

  const discountedPrice = product.en_oferta
    ? product.precio - (product.precio * product.descuento) / 100
    : product.precio

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="mb-4">
            <Image
              src={product.imagen || "/placeholder.svg"}
              alt={`${product.marca} ${product.modelo}`}
              width={600}
              height={600}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>

        {/* Product Details */}
        <div>
          <div className="mb-2 flex items-center">
            <span className="text-sm text-gray-500 capitalize">{categoria}</span>
            {product.es_nuevo && <span className="ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded">Nuevo</span>}
          </div>

          <h1 className="text-3xl font-bold mb-2">
            {product.marca} {product.modelo}
          </h1>

          <div className="flex items-center mb-4">
            <div className="flex">
              <Star className="w-5 h-5 fill-primary" />
              <Star className="w-5 h-5 fill-primary" />
              <Star className="w-5 h-5 fill-primary" />
              <Star className="w-5 h-5 fill-primary" />
              <Star className="w-5 h-5 fill-muted stroke-muted-foreground" />
            </div>
            <span className="ml-2 text-sm text-gray-500">(4.0)</span>
          </div>

          <div className="mb-4">
            {product.en_oferta ? (
              <div className="flex items-center">
                <span className="text-3xl font-bold text-red-600">${discountedPrice.toFixed(2)}</span>
                <span className="ml-2 text-xl text-gray-500 line-through">${product.precio.toFixed(2)}</span>
                <span className="ml-2 bg-black text-white px-2 py-1 text-sm rounded">-{product.descuento}%</span>
              </div>
            ) : (
              <span className="text-3xl font-bold">${product.precio.toFixed(2)}</span>
            )}
          </div>

          <Separator className="my-6" />

          {/* Product specific details */}
          <div className="mb-6 space-y-4">
            <div>
              <span className="font-semibold">Marca:</span> {product.marca}
            </div>
            <div>
              <span className="font-semibold">Modelo:</span> {product.modelo}
            </div>

            {categoria === "indumentaria" && (
              <>
                <div>
                  <span className="font-semibold">Tipo:</span> {product.tipo}
                </div>
                <div>
                  <span className="font-semibold">Talle:</span> {product.talle}
                </div>
              </>
            )}

            {categoria === "accesorios" && (
              <div>
                <span className="font-semibold">Tipo:</span> {product.tipo}
              </div>
            )}

            <div>
              <span className="font-semibold">Stock:</span> {product.stock} unidades
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Características:</h3>
            <p className="text-gray-700">{product.caracteristicas}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-black hover:bg-red-600 text-white">
              <ShoppingCart className="mr-2 h-5 w-5" /> Agregar al carrito
            </Button>
            <Button size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white">
              <Heart className="mr-2 h-5 w-5" /> Agregar a favoritos
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

