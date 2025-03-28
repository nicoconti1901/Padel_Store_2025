import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"
import styles from "./footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.section}>
            <h3 className={styles.title}>Sobre Nosotros</h3>
            <p className={styles.link}>
              Padel Store es tu tienda especializada en todo lo relacionado con el pádel.
              Ofrecemos los mejores productos de las marcas más reconocidas.
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
            <p className={styles.link}>Email: info@padelstore.com</p>
            <p className={styles.link}>Teléfono: +34 123 456 789</p>
            <p className={styles.link}>Dirección: Calle Principal 123, Madrid</p>
          </div>
          <div className={styles.section}>
            <h3 className={styles.title}>Síguenos</h3>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}>
                <Facebook size={24} />
              </a>
              <a href="#" className={styles.socialLink}>
                <Instagram size={24} />
              </a>
              <a href="#" className={styles.socialLink}>
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>&copy; 2024 Padel Store. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

