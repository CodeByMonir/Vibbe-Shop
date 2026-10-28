"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { useFetch } from "@/components/hooks/useFetch";
import LoadingSpinner from "@/components/loading/loading";
import ProductDetailsView from "./ProductDetailsView";
import CategoryDetailsView from "./CategoryDetailsView";

export default function ShopDynamicPage() {
    const params = useParams();
    const rawSlug = params?.slug ? decodeURIComponent(params.slug).toLowerCase().trim() : "";

    // Fetch Products
    const {
        data: rawProducts,
        loading: productsLoading,
        error: productsError,
        refetch: refetchProducts,
    } = useFetch("/data/products.json", {
        maxRetries: 3,
    });

    // Fetch Categories
    const {
        data: rawCategories,
        loading: categoriesLoading,
        error: categoriesError,
        refetch: refetchCategories,
    } = useFetch("/data/category.json", {
        maxRetries: 3,
    });

    const products = useMemo(() => (Array.isArray(rawProducts) ? rawProducts : []), [rawProducts]);
    const categories = useMemo(
        () => (Array.isArray(rawCategories) ? rawCategories : []),
        [rawCategories]
    );

    // Check 1: Does slug match a product by ID or Slug?
    const matchedProduct = useMemo(() => {
        if (!products.length || !rawSlug) return null;
        return products.find(
            (p) => String(p.id) === rawSlug || (p.slug && p.slug.toLowerCase() === rawSlug)
        );
    }, [products, rawSlug]);

    // Check 2: Does slug match a category from the fetched categories list?
    const matchedCategory = useMemo(() => {
        if (matchedProduct || !categories.length || !rawSlug) return null;
        return (
            categories.find((c) => {
                const catSlug = c.href ? c.href.replace("/shop/", "").toLowerCase() : "";
                return (
                    catSlug === rawSlug ||
                    (c.name && c.name.toLowerCase() === rawSlug) ||
                    (c.href && c.href.toLowerCase() === `/shop/${rawSlug}`)
                );
            }) || null
        );
    }, [matchedProduct, categories, rawSlug]);

    if (productsLoading || categoriesLoading) {
        return <LoadingSpinner fullScreen text="Loading catalogue..." />;
    }

    // Combined retry handler for error cases
    const handleRefetch = () => {
        if (productsError) refetchProducts();
        if (categoriesError) refetchCategories();
    };

    // 1. Render Product Details if matched (key forces instant fresh state per product)
    if (matchedProduct) {
        return (
            <ProductDetailsView
                key={matchedProduct.id}
                product={matchedProduct}
                products={products}
                categories={categories}
            />
        );
    }

    // 2. Render Category Grid if matched or treat as category by default
    return (
        <CategoryDetailsView
            key={rawSlug}
            categorySlug={rawSlug}
            categoryMeta={matchedCategory}
            products={products}
            categories={categories}
            error={productsError || categoriesError}
            refetch={handleRefetch}
        />
    );
}