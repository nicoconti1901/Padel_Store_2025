"use client"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import styles from "./header.module.css"

export function Header() {
  const { items } = useCart()
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/img/logo.png"
            alt="Pádel"
            width={300}
            height={60}
            priority
            className={styles.logoImage}
            style={{ width: '300px', height: '70px' }}
          />
        </Link>

        <nav className={styles.nav}>
          <Link href="/paletas" className={styles.navLink}>
            Paletas
          </Link>
          <Link href="/indumentaria" className={styles.navLink}>
            Indumentaria
          </Link>
          <Link href="/accesorios" className={styles.navLink}>
            Accesorios
          </Link>
        </nav>

        <button className={styles.cartButton}>
          <ShoppingCart className={styles.cartIcon} />
          <span className={styles.cartCount}>{itemCount}</span>
        </button>
      </div>
    </header>
  )
} 