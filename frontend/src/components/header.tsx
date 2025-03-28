"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import styles from "./header.module.css"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Padel Store
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
          <ShoppingCart size={24} />
          <span className={styles.cartCount}>0</span>
        </button>
      </div>
    </header>
  )
}

