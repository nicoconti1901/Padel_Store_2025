import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import styles from "./footer.module.css"

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.section}>
            <h3 className={styles.title}>Sobre Nosotros</h3>
            <p>
              Padel Pro Shop es tu tienda especializada en equipamiento de pádel.
              Ofrecemos las mejores marcas y productos para jugadores de todos los niveles.
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.title}>Enlaces Rápidos</h3>
            <Link href="/paletas" className={styles.link}>
              Paletas
            </Link>
            <Link href="/indumentaria" className={styles.link}>
              Indumentaria
            </Link>
            <Link href="/accesorios" className={styles.link}>
              Accesorios
            </Link>
          </div>

          <div className={styles.section}>
            <h3 className={styles.title}>Contacto</h3>
            <p>Email: info@padelproshop.com</p>
            <p>Teléfono: +34 123 456 789</p>
            <p>Dirección: Calle Principal 123, Madrid</p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.title}>Síguenos</h3>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.link}>
                <Facebook size={24} />
              </a>
              <a href="#" className={styles.link}>
                <Instagram size={24} />
              </a>
              <a href="#" className={styles.link}>
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} Padel Pro Shop. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
} 