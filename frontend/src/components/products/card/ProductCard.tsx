'use client';

import { Product } from '@/types/product';
import styles from './productCard.module.css';
import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    
    const {
        nombre,
        precio,
        precio_original,
        imagen,
        es_nuevo,
        en_oferta,
        descuento,
        marca_nombre
    } = product;

    const discountedPrice = en_oferta ? precio * (1 - descuento / 100) : precio;

    const handleAddToCart = () => {
        if (product && product.id) {
            addItem(product);
        }
    };

    const getCloudinaryImageUrl = (imageUrl: string): string => {
        // Si imageUrl es una ruta local (comienza con '/'), como '/placeholder.svg',
        // devuélvela directamente para que Next.js la maneje localmente.
        if (imageUrl.startsWith('/')) {
            return imageUrl;
        }

        // Si tenemos un Cloudinary cloud name y la imageUrl no es local, procesa con Cloudinary.
        const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        if (cloudinaryCloudName) {
            // w_300,h_300: dimensiones deseadas
            // c_fill,g_center: rellenar el espacio y recortar inteligentemente
            // q_auto: calidad automática
            // f_auto: formato automático (e.g., WebP)
            // dpr_auto: densidad de píxeles automática para pantallas HiDPI/Retina
            const transformations = 'w_300,h_300,c_fill,g_center,q_auto,f_auto,dpr_auto';
            return `https://res.cloudinary.com/${cloudinaryCloudName}/image/fetch/${transformations}/${encodeURIComponent(imageUrl)}`;
        }
        
        // Fallback: si cloudinaryCloudName no está configurado pero la URL no es local,
        // devuelve la URL original.
        return imageUrl;
    };

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <Image
                    src={getCloudinaryImageUrl(imagen || '/placeholder.svg')}
                    alt={`${marca_nombre} ${nombre}`}
                    width={300}
                    height={300}
                    className={styles.image}
                    unoptimized={true}
                />
                {es_nuevo && <span className={styles.newBadge}>Nuevo</span>}
                {en_oferta && <span className={styles.discountBadge}>{descuento}% OFF</span>}
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{nombre} • {marca_nombre}</h3>
                <div className={styles.priceContainer}>
                    {en_oferta ? (
                        <>
                            <span className={styles.originalPrice}>${precio_original}</span>
                            <span className={styles.discountPrice}>${discountedPrice.toFixed(2)}</span>
                        </>
                    ) : (
                        <span className={styles.price}>${precio}</span>
                    )}
                </div>
                <button 
                    onClick={handleAddToCart}
                    className={styles.addToCartButton}
                >
                    <svg 
                        className={styles.cartIcon}
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Agregar al carrito
                </button>
            </div>
        </div>
    );
} 