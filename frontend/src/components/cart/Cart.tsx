'use client';

import { useCart } from '@/hooks/use-cart';
import styles from './cart.module.css';
import Link from 'next/link';

export default function Cart() {
    const { items, removeItem, updateQuantity } = useCart();

    const total = items.reduce((sum, item) => {
        const price = item.product.en_oferta 
            ? item.product.precio * (1 - item.product.descuento / 100)
            : item.product.precio;
        return sum + (price * item.quantity);
    }, 0);

    if (items.length === 0) {
        return (
            <div className={styles.emptyCart}>
                <h2>Tu carrito está vacío</h2>
                <p>Agrega algunos productos para comenzar tu compra</p>
                <Link href="/" className={styles.continueShopping}>
                    Continuar comprando
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.cartContainer}>
            <h1 className={styles.title}>Carrito de Compras</h1>
            
            <div className={styles.itemsContainer}>
                {items.map((item) => (
                    <div key={item.product.id} className={styles.cartItem}>
                        <img 
                            src={item.product.imagen} 
                            alt={item.product.modelo} 
                            className={styles.itemImage}
                        />
                        
                        <div className={styles.itemDetails}>
                            <h3>{item.product.marca} • {item.product.modelo}</h3>
                            <div className={styles.priceContainer}>
                                {item.product.en_oferta ? (
                                    <>
                                        <span className={styles.originalPrice}>
                                            ${item.product.precio}
                                        </span>
                                        <span className={styles.discountPrice}>
                                            ${(item.product.precio * (1 - item.product.descuento / 100)).toFixed(2)}
                                        </span>
                                    </>
                                ) : (
                                    <span className={styles.price}>
                                        ${item.product.precio}
                                    </span>
                                )}
                            </div>
                            
                            <div className={styles.quantityControls}>
                                <button 
                                    onClick={() => {
                                        const id = Number(item.product.id);
                                        if (!isNaN(id) && id > 0) {
                                            updateQuantity(id, item.quantity - 1);
                                        }
                                    }}
                                    disabled={item.quantity <= 1}
                                    className={styles.quantityButton}
                                >
                                    -
                                </button>
                                <span className={styles.quantity}>{item.quantity}</span>
                                <button 
                                    onClick={() => {
                                        const id = Number(item.product.id);
                                        if (!isNaN(id) && id > 0) {
                                            updateQuantity(id, item.quantity + 1);
                                        }
                                    }}
                                    className={styles.quantityButton}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button 
                            onClick={() => {
                                const id = Number(item.product.id);
                                if (!isNaN(id) && id > 0) {
                                    removeItem(id);
                                }
                            }}
                            className={styles.removeButton}
                        >
                            Eliminar
                        </button>
                    </div>
                ))}
            </div>

            <div className={styles.summary}>
                <div className={styles.total}>
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                <div className={styles.buttonContainer}>
                    <Link href="/" className={styles.continueShopping}>
                        Seguir comprando
                    </Link>
                    <button className={styles.checkoutButton}>
                        Proceder al Pago
                    </button>
                </div>
            </div>
        </div>
    );
} 