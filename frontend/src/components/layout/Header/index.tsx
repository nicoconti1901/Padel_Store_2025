"use client"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, LogOut, LogIn } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import styles from "./header.module.css"
import { useRouter } from 'next/navigation'

export function Header() {
  const { isAuthenticated, isAdmin, logout, isLoading } = useAuth()
  const router = useRouter()

  console.log('[Header Render] Is Loading:', isLoading, 'Is Authenticated:', isAuthenticated, 'Is Admin:', isAdmin)

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

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
          {isAuthenticated && isAdmin && (
            <Link href="/admin/products" className={styles.navLinkAdmin}>Admin</Link>
          )}
        </nav>

        <div className={styles.actions}>
          <button className={styles.cartButton} aria-label="Carrito de compras">
            <ShoppingCart size={20} />
          </button>
          {!isLoading && (
            isAuthenticated ? (
              <button onClick={handleLogout} className={styles.authButton} aria-label="Cerrar sesión">
                <LogOut size={20} />
                <span>Salir</span>
              </button>
            ) : (
              <Link href="/login" className={styles.authButton} aria-label="Iniciar sesión">
                <LogIn size={20} />
                <span>Ingresar</span>
              </Link>
            )
          )}
          {isLoading && <div style={{width: '80px', textAlign: 'center'}}><span className={styles.loadingSpinner}></span></div>}
        </div>
      </div>
    </header>
  )
} 