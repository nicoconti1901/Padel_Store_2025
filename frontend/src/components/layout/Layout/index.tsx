import { Header } from "../Header"
import { Footer } from "../Footer"
import styles from "./layout.module.css"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
} 