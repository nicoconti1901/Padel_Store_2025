import { Hero } from "@/components/layout/Hero"
import { FeaturedProducts } from "@/components/products/FeaturedProducts"
import  Separator  from "@/components/layout/Separator"

export default function Home() {
  return (
    <main>
      <Hero />
      <Separator />
      <FeaturedProducts />
    </main>
  )
}

