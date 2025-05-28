'use client';

import { Hero } from "@/components/layout/Hero"
import { FeaturedProducts } from "@/components/products/featured/FeaturedProducts"
import Separator from "@/components/layout/Separator"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import styles from "./page.module.css"

export default function Home() {
  const { isAdmin } = useAuth();

  if (isAdmin) {
    return (
      <main className={styles.adminMain}>
        <div className={styles.adminContent}>
          <h1>Panel de Administración</h1>
          <p>Bienvenido al panel de administración de la tienda de pádel.</p>
          <Link href="/admin/products" className={styles.createButton}>
            Gestionar Productos
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main>
      <Hero />
      <Separator />
      <FeaturedProducts />
    </main>
  )
}

