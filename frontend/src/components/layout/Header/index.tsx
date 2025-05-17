"use client"
import Link from "next/link"
import { ShoppingCart, LogOut, LogIn } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import styles from "./header.module.css"
import { useRouter } from 'next/navigation'
import { PadelLogo } from "./PadelLogo"
import Image from "next/image"

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
            src="/img/padel-icon.png"
            alt="Logo pádel"
            width={48}
            height={48}
            style={{ marginRight: "0.7rem" }}
            priority
          />
          <span className={styles.logoText}>X3 PADEL</span>
        </Link>

        <nav className={styles.nav}>
          {!isAuthenticated && (
            <>
              <Link href="/paletas" className={styles.navLink}>
                Paletas
              </Link>
              <Link href="/indumentaria" className={styles.navLink}>
                Indumentaria
              </Link>
              <Link href="/accesorios" className={styles.navLink}>
                Accesorios
              </Link>
            </>
          )}
          {isAuthenticated && isAdmin && (
            <Link href="/admin/products" className={styles.navLinkAdmin}>
              Administración
            </Link>
          )}
        </nav>

        <div className={styles.actions}>
          {!isAuthenticated && (
            <button className={styles.cartButton} aria-label="Carrito de compras">
              <ShoppingCart size={20} />
            </button>
          )}
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