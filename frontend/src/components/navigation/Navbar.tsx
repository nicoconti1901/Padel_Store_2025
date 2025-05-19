'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import styles from './navbar.module.css';

export default function Navbar() {
    const { items } = useCart();
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    Padel Store
                </Link>

                <div className={styles.links}>
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

                <Link 
                    href="/carrito" 
                    className={styles.cartLink}
                    prefetch={true}
                >
                    <span className={styles.cartIcon}>🛒</span>
                    {itemCount > 0 && (
                        <span className={styles.cartCount}>{itemCount}</span>
                    )}
                </Link>
            </div>
        </nav>
    );
} 