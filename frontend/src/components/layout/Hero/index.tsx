"use client"

import Image from "next/image"
import Link from "next/link"
import styles from "./hero.module.css"

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Descubre nuestra colección de productos para pádel
          </h1>
          <p className={styles.subtitle}>
            Las mejores paletas, indumentaria y accesorios para jugadores de todos los niveles
          </p>
          <Link href="/paletas" className={styles.cta}>
            Ver productos
          </Link>
        </div>
      </div>
      <Image
        src="/img/fondo1.jpeg"
        alt="Pádel"
        width={1920}
        height={1580}
        className={styles.backgroundImage}
        priority
      />
    </section>
  )
} 