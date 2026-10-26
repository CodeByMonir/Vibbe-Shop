"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

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

            if (savedCart) {
                const parsed = JSON.parse(savedCart);
                if (Array.isArray(parsed)) setCart(parsed);
            }
            if (savedFavorites) {
                const parsed = JSON.parse(savedFavorites);
                if (Array.isArray(parsed)) setFavorites(parsed);
            }
        } catch (error) {
            console.error("Failed to load state from localStorage:", error);
        } finally {
            setIsInitialized(true);
        }
    }, []);

    // Sync cart updates to localStorage
    useEffect(() => {
        if (isInitialized) {
            try {
                localStorage.setItem("vibbe_cart", JSON.stringify(cart));
            } catch (err) {
                console.error("Failed saving cart to localStorage:", err);
            }
        }
    }, [cart, isInitialized]);

    // Sync favorites updates to localStorage
    useEffect(() => {
        if (isInitialized) {
            try {
                localStorage.setItem("vibbe_favorites", JSON.stringify(favorites));
            } catch (err) {
                console.error("Failed saving favorites to localStorage:", err);
            }
        }
    }, [favorites, isInitialized]);

    // --- Cart Actions ---

    /**
     * Add an item to the shopping bag.
     * Supports: (product), (product, size), or (product, size, quantity).
     * Checks for both ID, Size, and Color to avoid variant collisions.
     */
    const addToCart = useCallback((product, selectedSize = null, customQty = 1) => {
        if (!product || !product.id) return;

        // 1. Resolve Size
        const sizeToUse =
            selectedSize ||
            product.selectedSize ||
            product.size ||
            (Array.isArray(product.sizes) && product.sizes[0]) ||
            "Standard";

        // 2. Resolve Color
        const colorToUse =
            product.color ||
            (Array.isArray(product.colors) && product.colors[0]) ||
            "Standard";

        // 3. Resolve Quantity
        const qtyToAdd = Math.max(
            1,
            Number(customQty) || Number(product.quantity) || 1
        );

        setCart((prev) => {
            // Find matching item by id, size, AND color
            const existingIndex = prev.findIndex(
                (item) =>
                    String(item.id) === String(product.id) &&
                    String(item.size).toLowerCase() === String(sizeToUse).toLowerCase() &&
                    String(item.color).toLowerCase() === String(colorToUse).toLowerCase()
            );

            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + qtyToAdd,
                };
                return updated;
            }

            // New line item
            return [
                ...prev,
                {
                    id: product.id,
                    name: product.name,
                    category: product.category || "Apparel",
                    price: Number(product.price) || 0,
                    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
                    image: product.image || "/placeholder.png",
                    color: colorToUse,
                    size: sizeToUse,
                    quantity: qtyToAdd,
                    badge: product.badge || null,
                },
            ];
        });
    }, []);

    /**
     * Remove item matching ID, Size, and optional Color.
     */
    const removeFromCart = useCallback((id, size, color = null) => {
        setCart((prev) =>
            prev.filter((item) => {
                const matchId = String(item.id) === String(id);
                const matchSize = String(item.size).toLowerCase() === String(size).toLowerCase();
                const matchColor = color
                    ? String(item.color).toLowerCase() === String(color).toLowerCase()
                    : true;

                // Keep item if it does NOT match all criteria
                return !(matchId && matchSize && matchColor);
            })
        );
    }, []);

    /**
     * Increment or decrement item quantity.
     */
    const updateCartQuantity = useCallback((id, size, delta, color = null) => {
        setCart((prev) =>
            prev
                .map((item) => {
                    const matchId = String(item.id) === String(id);
                    const matchSize = String(item.size).toLowerCase() === String(size).toLowerCase();
                    const matchColor = color
                        ? String(item.color).toLowerCase() === String(color).toLowerCase()
                        : true;

                    if (matchId && matchSize && matchColor) {
                        const nextQty = item.quantity + delta;
                        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
                    }
                    return item;
                })
                .filter(Boolean)
        );
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    // --- Favorites / Wishlist Actions ---

    const toggleFavorite = useCallback((product) => {
        if (!product || !product.id) return;

        setFavorites((prev) => {
            const exists = prev.some((item) => String(item.id) === String(product.id));

            if (exists) {
                return prev.filter((item) => String(item.id) !== String(product.id));
            }

            return [
                ...prev,
                {
                    id: product.id,
                    name: product.name,
                    category: product.category || "Apparel",
                    price: Number(product.price) || 0,
                    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
                    image: product.image || "/placeholder.png",
                    selectedSize:
                        product.selectedSize ||
                        product.size ||
                        (Array.isArray(product.sizes) && product.sizes[0]) ||
                        "Standard",
                    inStock: product.inStock !== false,
                },
            ];
        });
    }, []);

    const isFavorite = useCallback(
        (id) => {
            if (!id) return false;
            return favorites.some((item) => String(item.id) === String(id));
        },
        [favorites]
    );

    const clearFavorites = useCallback(() => {
        setFavorites([]);
    }, []);

    // --- Derived Calculations ---

    const cartCount = useMemo(() => {
        return cart.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
    }, [cart]);

    const cartSubtotal = useMemo(() => {
        return cart.reduce(
            (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
            0
        );
    }, [cart]);

    const favoritesCount = useMemo(() => favorites.length, [favorites]);

    const contextValue = useMemo(
        () => ({
            // State
            cart,
            cartCount,
            cartSubtotal,
            favorites,
            favoritesCount,
            isInitialized,

            // Cart API
            addToCart,
            removeFromCart,
            updateCartQuantity,
            clearCart,

            // Favorites API
            toggleFavorite,
            isFavorite,
            clearFavorites,
        }),
        [
            cart,
            cartCount,
            cartSubtotal,
            favorites,
            favoritesCount,
            isInitialized,
            addToCart,
            removeFromCart,
            updateCartQuantity,
            clearCart,
            toggleFavorite,
            isFavorite,
            clearFavorites,
        ]
    );

    return (
        <StoreContext.Provider value={contextValue}>
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