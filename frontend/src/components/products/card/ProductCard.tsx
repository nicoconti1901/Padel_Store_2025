'use client';

import { Product } from '@/types/product';
import styles from './productCard.module.css';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const {
        marca,
        modelo,
        precio,
        imagen,
        es_nuevo,
        en_oferta,
        descuento
    } = product;

    const discountedPrice = en_oferta ? precio * (1 - descuento / 100) : precio;

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <img src={imagen} alt={`${marca} ${modelo}`} className={styles.image} />
                {es_nuevo && <span className={styles.newBadge}>Nuevo</span>}
                {en_oferta && <span className={styles.discountBadge}>{descuento}% OFF</span>}
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{marca} {modelo}</h3>
                <div className={styles.priceContainer}>
                    {en_oferta ? (
                        <>
                            <span className={styles.originalPrice}>${precio}</span>
                            <span className={styles.discountPrice}>${discountedPrice.toFixed(2)}</span>
                        </>
                    ) : (
                        <span className={styles.price}>${precio}</span>
                    )}
                </div>
            </div>
        </div>
    );
} 