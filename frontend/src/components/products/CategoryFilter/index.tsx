"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import styles from "./styles.module.css"

const categories = [
  { id: "paletas", label: "Paletas" },
  { id: "indumentaria", label: "Indumentaria" },
  { id: "accesorios", label: "Accesorios" },
]

export function CategoryFilter() {
  const params = useParams()
  const currentCategory = params.categoria as string

  return (
    <div className={styles.filter}>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/${category.id}`}
          className={`${styles.category} ${
            currentCategory === category.id ? styles.active : ""
          }`}
        >
          {category.label}
        </Link>
      ))}
    </div>
  )
} 