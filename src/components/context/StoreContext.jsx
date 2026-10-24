"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load saved state from localStorage on client mount
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem("vibbe_cart");
            const savedFavorites = localStorage.getItem("vibbe_favorites");
            if (savedCart) setCart(JSON.parse(savedCart));
            if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
        } catch (error) {
            console.error("Failed to load cart/favorites from localStorage:", error);
        } finally {
            setIsInitialized(true);
        }
    }, []);

    // Sync cart updates to localStorage
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("vibbe_cart", JSON.stringify(cart));
        }
    }, [cart, isInitialized]);

    // Sync favorites updates to localStorage
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("vibbe_favorites", JSON.stringify(favorites));
        }
    }, [favorites, isInitialized]);

    // --- Cart Actions ---
    const addToCart = (product, selectedSize = null) => {
        const sizeToUse =
            selectedSize ||
            (Array.isArray(product?.sizes) && product.sizes[0]) ||
            "One Size";

        setCart((prev) => {
            const existingIndex = prev.findIndex(
                (item) => item.id === product.id && item.size === sizeToUse
            );

            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += 1;
                return updated;
            }

            return [
                ...prev,
                {
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    originalPrice: product.originalPrice || null,
                    image: product.image,
                    color: (product.colors && product.colors[0]) || "Standard",
                    size: sizeToUse,
                    quantity: 1,
                },
            ];
        });
    };

    const removeFromCart = (id, size) => {
        setCart((prev) =>
            prev.filter((item) => !(item.id === id && item.size === size))
        );
    };

    const updateCartQuantity = (id, size, delta) => {
        setCart((prev) =>
            prev
                .map((item) => {
                    if (item.id === id && item.size === size) {
                        const nextQty = item.quantity + delta;
                        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
                    }
                    return item;
                })
                .filter(Boolean)
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    // --- Favorites / Wishlist Actions ---
    const toggleFavorite = (product) => {
        setFavorites((prev) => {
            const exists = prev.some((item) => item.id === product.id);
            if (exists) {
                return prev.filter((item) => item.id !== product.id);
            }
            return [
                ...prev,
                {
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    originalPrice: product.originalPrice || null,
                    image: product.image,
                    selectedSize: (product.sizes && product.sizes[0]) || "Standard",
                    inStock: product.inStock !== false,
                },
            ];
        });
    };

    const isFavorite = (id) => {
        return favorites.some((item) => item.id === id);
    };

    const clearFavorites = () => {
        setFavorites([]);
    };

    // Totals & Derived Counts
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const favoritesCount = favorites.length;

    return (
        <StoreContext.Provider
            value={{
                cart,
                cartCount,
                addToCart,
                removeFromCart,
                updateCartQuantity,
                clearCart,
                favorites,
                favoritesCount,
                toggleFavorite,
                isFavorite,
                clearFavorites,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
}