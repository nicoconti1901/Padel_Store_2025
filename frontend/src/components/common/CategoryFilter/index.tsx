import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import styles from "./categoryFilter.module.css"

interface CategoryFilterProps {
  onPriceChange: (min: number, max: number) => void
  onBrandChange: (brands: string[]) => void
  onNewChange: (showNew: boolean) => void
  onSaleChange: (showSale: boolean) => void
  brands: string[]
}

export function CategoryFilter({
  onPriceChange,
  onBrandChange,
  onNewChange,
  onSaleChange,
  brands,
}: CategoryFilterProps) {
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [showNew, setShowNew] = useState(false)
  const [showSale, setShowSale] = useState(false)

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    onPriceChange(value[0], value[1])
  }

  const handleBrandChange = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand]
    setSelectedBrands(newBrands)
    onBrandChange(newBrands)
  }

  const handleNewChange = (checked: boolean) => {
    setShowNew(checked)
    onNewChange(checked)
  }

  const handleSaleChange = (checked: boolean) => {
    setShowSale(checked)
    onSaleChange(checked)
  }

  return (
    <div className={styles.filter}>
      <h3 className={styles.title}>Filtros</h3>
      <Separator className={styles.separator} />

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Rango de Precio</h4>
        <div className={styles.priceRange}>
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            min={0}
            max={500}
            step={10}
            className={styles.slider}
          />
          <div className={styles.priceLabels}>
            <span>{priceRange[0]}€</span>
            <span>{priceRange[1]}€</span>
          </div>
        </div>
      </div>

      <Separator className={styles.separator} />

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Marcas</h4>
        <div className={styles.brands}>
          {brands.map((brand) => (
            <label key={brand} className={styles.brandLabel}>
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => handleBrandChange(brand)}
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator className={styles.separator} />

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Estado</h4>
        <div className={styles.options}>
          <label className={styles.optionLabel}>
            <Checkbox
              checked={showNew}
              onCheckedChange={handleNewChange}
            />
            <span>Nuevos</span>
          </label>
          <label className={styles.optionLabel}>
            <Checkbox
              checked={showSale}
              onCheckedChange={handleSaleChange}
            />
            <span>En Oferta</span>
          </label>
        </div>
      </div>
    </div>
  )
} 