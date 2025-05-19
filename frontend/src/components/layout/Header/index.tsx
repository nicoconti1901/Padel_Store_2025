"use client"
import Link from "next/link"
import { ShoppingCart, LogOut, LogIn } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import styles from "./header.module.css"
import { useRouter, usePathname } from 'next/navigation'
import Image from "next/image"
import { useState } from "react"

export function Header() {
  const { isAuthenticated, isAdmin, logout, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  console.log('[Header Render] Is Loading:', isLoading, 'Is Authenticated:', isAuthenticated, 'Is Admin:', isAdmin)

  const handleLogout = async () => {
    await logout()
    router.push('/')
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/img/padel-icon.png"
            alt="Logo pádel"
            width={40}
            height={40}
            style={{ marginRight: "0.7rem" }}
            priority
          />
          <span className={styles.logoText}>
            {Array.from("X3-PADEL").map((char, index) => (
              <span 
                key={index} 
                style={{ 
                  color: index % 2 === 0 ? '#FFFFFF' : '#FF6B00',
                  display: 'inline-block'
                }}
              >
                {char}
              </span>
            ))}
          </span>
          
          <Image
            src="/img/padel-icon.png"
            alt="Logo pádel"
            width={40}
            height={40}
            style={{ marginRight: "0.7rem" }}
            priority
            className={styles.logoImgEnd}
          />
        </Link>

        <nav className={styles.nav}>
          {!isAuthenticated && (
            <>
              <Link 
                href="/paletas" 
                className={`${styles.navLink} ${isActive('/paletas') ? styles.active : ''}`}
              >
                Paletas
              </Link>
              <Link 
                href="/indumentaria" 
                className={`${styles.navLink} ${isActive('/indumentaria') ? styles.active : ''}`}
              >
                Indumentaria
              </Link>
              <Link 
                href="/accesorios" 
                className={`${styles.navLink} ${isActive('/accesorios') ? styles.active : ''}`}
              >
                Accesorios
              </Link>
            </>
          )}
          {isAuthenticated && isAdmin && (
            <Link 
              href="/admin/products" 
              className={`${styles.navLinkAdmin} ${isActive('/admin/products') ? styles.active : ''}`}
            >
              Administración
            </Link>
          )}
        </nav>

        <div className={styles.rightSection}>
          <button 
            className={`${styles.hamburgerButton} ${isMenuOpen ? styles.active : ''}`}
            onClick={toggleMenu}
            aria-label="Menú"
          >
            <span className={styles.hamburgerIcon}></span>
          </button>

          <div className={styles.actions}>
            {!isAuthenticated && (
              <button className={styles.cartButton} aria-label="Carrito de compras" style={{marginRight: '0.5rem'}}>
                <ShoppingCart size={18} />
              </button>
            )}
            {!isLoading && (
              isAuthenticated ? (
                <button onClick={handleLogout} className={styles.authButton} aria-label="Cerrar sesión">
                  <LogOut size={18} />
                  <span>Salir</span>
                </button>
              ) : (
                <Link href="/login" className={styles.authButton} aria-label="Iniciar sesión">
                  <LogIn size={18} />
                  <span>Ingresar</span>
                </Link>
              )
            )}
            {isLoading && <div style={{width: '60px', textAlign: 'center'}}><span className={styles.loadingSpinner}></span></div>}
          </div>
        </div>
      </div>

      <div className={`${styles.overlay} ${isMenuOpen ? styles.active : ''}`} onClick={closeMenu}></div>
      
      <nav className={`${styles.mobileNav} ${isMenuOpen ? styles.active : ''}`}>
        <div className={styles.mobileNavList}>
          {!isAuthenticated && (
            <>
              <Link 
                href="/paletas" 
                className={`${styles.mobileNavLink} ${isActive('/paletas') ? styles.active : ''}`} 
                onClick={closeMenu}
              >
                Paletas
              </Link>
              <Link 
                href="/indumentaria" 
                className={`${styles.mobileNavLink} ${isActive('/indumentaria') ? styles.active : ''}`} 
                onClick={closeMenu}
              >
                Indumentaria
              </Link>
              <Link 
                href="/accesorios" 
                className={`${styles.mobileNavLink} ${isActive('/accesorios') ? styles.active : ''}`} 
                onClick={closeMenu}
              >
                Accesorios
              </Link>
            </>
          )}
          {isAuthenticated && isAdmin && (
            <Link 
              href="/admin/products" 
              className={`${styles.mobileNavLink} ${isActive('/admin/products') ? styles.active : ''}`} 
              onClick={closeMenu}
            >
              Administración
            </Link>
          )}
          {!isAuthenticated && (
            <Link href="/login" className={styles.mobileNavLink} onClick={closeMenu}>
              <LogIn size={18} style={{ marginRight: '0.5rem' }} />
              Ingresar
            </Link>
          )}
          {isAuthenticated && (
            <button onClick={handleLogout} className={styles.mobileNavLink}>
              <LogOut size={18} style={{ marginRight: '0.5rem' }} />
              Salir
            </button>
          )}
        </div>
      </nav>
    </header>
  )
} 