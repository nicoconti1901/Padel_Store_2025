import Image from "next/image"
import Link from "next/link"
import styles from "./hero.module.css"

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Image
        src="/img/fondo1.jpeg"
        alt="Hero background"
        fill
        className={styles.image}
        priority
        quality={100}
      />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>Descubre el Mejor Equipamiento de Pádel</h1>
        <p className={styles.subtitle}>
          Encuentra las mejores paletas, indumentaria y accesorios para tu juego
        </p>
        <Link href="/productos" className={styles.button}>
          Ver Productos
        </Link>
      </div>
    </section>
  )
} 