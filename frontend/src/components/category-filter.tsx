"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function CategoryFilter() {
  const [priceRange, setPriceRange] = useState([0, 300])

  const categories = [
    { id: "paletas", label: "Paletas" },
    { id: "indumentaria", label: "Indumentaria" },
    { id: "accesorios", label: "Accesorios" },
  ]

  const subcategories = {
    paletas: [
      { id: "potencia", label: "Potencia" },
      { id: "control", label: "Control" },
      { id: "mixta", label: "Mixta" },
    ],
    indumentaria: [
      { id: "remeras", label: "Remeras" },
      { id: "shorts", label: "Shorts" },
      { id: "zapatillas", label: "Zapatillas" },
    ],
    accesorios: [
      { id: "bolsos", label: "Bolsos" },
      { id: "grips", label: "Grips" },
      { id: "protectores", label: "Protectores" },
    ],
  }

  const brands = [
    { id: "brand1", label: "Bullpadel" },
    { id: "brand2", label: "Head" },
    { id: "brand3", label: "Adidas" },
    { id: "brand4", label: "Wilson" },
    { id: "brand5", label: "Nox" },
  ]

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="font-bold text-xl mb-4">Filtros</h3>

      <Accordion type="multiple" defaultValue={["categories", "price"]}>
        <AccordionItem value="categories">
          <AccordionTrigger className="text-lg font-medium">Categorías</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id={category.id} />
                    <label
                      htmlFor={category.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.label}
                    </label>
                  </div>

                  <div className="pl-6 space-y-1">
                    {subcategories[category.id as keyof typeof subcategories]?.map((subcategory) => (
                      <div key={subcategory.id} className="flex items-center space-x-2">
                        <Checkbox id={subcategory.id} />
                        <label
                          htmlFor={subcategory.id}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {subcategory.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-lg font-medium">Precio</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider defaultValue={[0, 300]} max={300} step={1} value={priceRange} onValueChange={setPriceRange} />
              <div className="flex items-center justify-between">
                <span className="text-sm">${priceRange[0]}</span>
                <span className="text-sm">${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brands">
          <AccordionTrigger className="text-lg font-medium">Marcas</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox id={brand.id} />
                  <label
                    htmlFor={brand.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {brand.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="offers">
          <AccordionTrigger className="text-lg font-medium">Ofertas</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="on-sale" />
                <label
                  htmlFor="on-sale"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  En oferta
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="new-arrivals" />
                <label
                  htmlFor="new-arrivals"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Nuevos productos
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6 space-y-2">
        <Button className="w-full bg-red-600 hover:bg-red-700">Aplicar Filtros</Button>
        <Button variant="outline" className="w-full">
          Limpiar Filtros
        </Button>
      </div>
    </div>
  )
}

