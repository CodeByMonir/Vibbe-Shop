"use client";

import { authClient } from "@/lib/auth-client";
import { useStore } from "@/components/context/StoreContext";
import { AnimatePresence, motion } from "framer-motion";
import {
	Heart,
	LayoutDashboard,
	Loader2,
	LogOut,
	Mail,
	Menu,
	Package,
	Search,
	ShoppingBag,
	User,
	X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { useAuth } from "../context/AuthContext";

// React-compliant hook to suppress hydration mismatches without setState in useEffect
const emptySubscribe = () => () => {};
function useIsMounted() {
	return useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false,
	);
}

export default function Navbar() {
	const router = useRouter();
	const { cartCount, favoritesCount } = useStore();
	const mounted = useIsMounted();

	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [profileModalOpen, setProfileModalOpen] = useState(false);
	const [googleLoading, setGoogleLoading] = useState(false);

	// Consume session and user directly from custom AuthContext
	const { user, loading: authLoading, refreshSession } = useAuth();
	const isSignedIn = Boolean(user);

	const navLinks = [
		{ name: "Search", href: "/shop", icon: Search },
		{
			name: "Favorites",
			href: "/favorites",
			icon: Heart,
			badge:
				mounted && favoritesCount > 0
					? favoritesCount > 99
						? "99+"
						: favoritesCount
					: null,
		},
		{
			name: "Cart",
			href: "/cart",
			icon: ShoppingBag,
			badge:
				mounted && cartCount > 0
					? cartCount > 99
						? "99+"
						: cartCount
					: null,
		},
	];

	// Direct Google Social Login via Better Auth
	const handleGoogleSignIn = async () => {
		try {
			setGoogleLoading(true);
			await authClient.signIn.social({
				provider: "google",
				callbackURL: window.location.href,
			});
		} catch (err) {
			console.error("Google sign-in error:", err);
			setGoogleLoading(false);
		}
	};

	// Sign out and re-sync context
	const handleSignOut = async () => {
		try {
			await authClient.signOut();
			await refreshSession();
		} catch (err) {
			console.error("Sign-out error:", err);
		} finally {
			setProfileModalOpen(false);
			router.refresh();
		}
	};

	return (
		<>
			<header className="sticky top-0 z-40 w-full bg-[#ffffff] border-b border-[#e5e7eb]">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16 sm:h-20">
						{/* Left: Brand Identity */}
						<div className="flex items-center gap-3">
							<Link
								href="/"
								className="flex items-center gap-1.5 group"
							>
								<div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0">
									<Image
										src="/img/logo/vibbeLogo.png"
										alt="Vibbe Logo"
										fill
										sizes="40px"
										className="object-contain"
										priority
									/>
								</div>
								<span className="text-xl sm:text-2xl font-black tracking-tight text-[#000000] uppercase">
									Vibbe
								</span>
							</Link>
						</div>

						{/* Desktop Navigation Links & Profile Trigger */}
						<nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
							{navLinks.map((item) => {
								const Icon = item.icon;
								return (
									<Link
										key={item.name}
										href={item.href}
										aria-label={item.name}
										className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#444444] hover:text-[#000000] transition-colors rounded-none focus-visible:outline-2 focus-visible:outline-[#000000] focus-visible:outline-offset-2"
									>
										<Icon className="w-6 h-6 text-[#333333]" />

										{item.badge && (
											<span className="absolute top-1 right-1 w-4 h-4 text-[9px] font-bold text-white bg-[#000000] rounded-full flex items-center justify-center">
												{item.badge}
											</span>
										)}
									</Link>
								);
							})}

							{/* Desktop Profile Button */}
							<button
								type="button"
								onClick={() => setProfileModalOpen(true)}
								aria-label="User Account"
								className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#444444] hover:text-[#000000] transition-colors rounded-none focus-visible:outline-2 focus-visible:outline-[#000000] focus-visible:outline-offset-2 cursor-pointer"
							>
								{user?.image ? (
									<div className="relative w-6 h-6 rounded-full overflow-hidden border border-[#e5e7eb]">
										<Image
											src={user.image}
											alt={user.name || "User"}
											fill
											className="object-cover"
										/>
									</div>
								) : (
									<User className="w-6 h-6 text-[#333333]" />
								)}
							</button>
						</nav>

						{/* Mobile Navigation Controls */}
						<div className="flex items-center gap-2 md:hidden">
							<button
								type="button"
								onClick={() => setProfileModalOpen(true)}
								className="p-2 text-[#222222] focus-visible:outline-2 focus-visible:outline-[#000000]"
								aria-label="Account Settings"
							>
								{user?.image ? (
									<div className="relative w-5 h-5 rounded-full overflow-hidden border border-[#e5e7eb]">
										<Image
											src={user.image}
											alt={user.name || "User"}
											fill
											className="object-cover"
										/>
									</div>
								) : (
									<User className="w-5 h-5" />
								)}
							</button>

							<Link
								href="/cart"
								className="relative p-2 text-[#222222] focus-visible:outline-2 focus-visible:outline-[#000000]"
								aria-label="Shopping Cart"
							>
								<ShoppingBag className="w-5 h-5" />
								{mounted && cartCount > 0 && (
									<span className="absolute top-1 right-1 w-4 h-4 text-[9px] font-bold text-white bg-[#000000] rounded-full flex items-center justify-center">
										{cartCount > 99 ? "99+" : cartCount}
									</span>
								)}
							</Link>

							<button
								onClick={() =>
									setMobileMenuOpen((prev) => !prev)
								}
								aria-expanded={mobileMenuOpen}
								aria-label={
									mobileMenuOpen ? "Close menu" : "Open menu"
								}
								className="p-2 text-[#000000] rounded-sm focus-visible:outline-2 focus-visible:outline-[#000000]"
							>
								{mobileMenuOpen ? (
									<X className="w-6 h-6" />
								) : (
									<Menu className="w-6 h-6" />
								)}
							</button>
						</div>
					</div>
				</div>

				{/* Mobile Drawer Dropdown */}
				<AnimatePresence>
					{mobileMenuOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{
								duration: 0.25,
								ease: [0.25, 1, 0.5, 1],
							}}
							className="md:hidden overflow-hidden border-t border-[#e5e7eb] bg-[#ffffff]"
						>
							<div className="px-4 py-4 space-y-1">
								{navLinks.map((item) => {
									const Icon = item.icon;
									return (
										<Link
											key={item.name}
											href={item.href}
											onClick={() =>
												setMobileMenuOpen(false)
											}
											className="flex items-center justify-between px-3 py-3 text-sm font-semibold uppercase tracking-wider text-[#333333] hover:bg-[#f9fafb] transition-colors rounded-none"
										>
											<div className="flex items-center gap-3">
												<Icon className="w-5 h-5 text-[#000000]" />
												<span>{item.name}</span>
											</div>
											{item.badge && (
												<span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-[#000000] rounded-full">
													{item.badge}
												</span>
											)}
										</Link>
									);
								})}

								<button
									type="button"
									onClick={() => {
										setMobileMenuOpen(false);
										setProfileModalOpen(true);
									}}
									className="w-full flex items-center justify-between px-3 py-3 text-sm font-semibold uppercase tracking-wider text-[#333333] hover:bg-[#f9fafb] transition-colors rounded-none cursor-pointer"
								>
									<div className="flex items-center gap-3">
										<User className="w-5 h-5 text-[#000000]" />
										<span>
											{isSignedIn
												? user?.name || "My Account"
												: "Sign In / Profile"}
										</span>
									</div>
								</button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</header>

			{/* Profile / Authentication Modal */}
			<AnimatePresence>
				{profileModalOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setProfileModalOpen(false)}
							className="fixed inset-0 bg-black/60 backdrop-blur-xs"
						/>

						<motion.div
							role="dialog"
							aria-modal="true"
							aria-labelledby="profile-modal-title"
							initial={{ opacity: 0, scale: 0.95, y: 10 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 10 }}
							transition={{ duration: 0.2, ease: "easeOut" }}
							className="relative w-full max-w-sm bg-white border border-[#e5e7eb] p-6 shadow-2xl z-10"
						>
							<button
								type="button"
								onClick={() => setProfileModalOpen(false)}
								className="absolute top-4 right-4 text-[#71717A] hover:text-[#000000] transition-colors cursor-pointer"
								aria-label="Close modal"
							>
								<X className="w-4 h-4" />
							</button>

							{authLoading ? (
								<div className="py-12 flex flex-col items-center justify-center text-center">
									<Loader2 className="w-6 h-6 animate-spin text-[#000000] mb-2" />
									<p className="text-xs uppercase font-bold tracking-wider text-[#71717A]">
										Verifying Session...
									</p>
								</div>
							) : isSignedIn ? (
								/* Authenticated State */
								<div>
									<div className="flex items-center gap-3 pb-4 border-b border-[#e5e7eb]">
										{user?.image ? (
											<div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#e5e7eb] shrink-0">
												<Image
													src={user.image}
													alt={user.name || "User"}
													fill
													className="object-cover"
												/>
											</div>
										) : (
											<div className="w-12 h-12 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-base shrink-0">
												{user?.name?.[0]?.toUpperCase() ||
													"U"}
											</div>
										)}
										<div className="min-w-0">
											<h3
												id="profile-modal-title"
												className="text-sm font-black uppercase text-[#000000] tracking-wide truncate"
											>
												{user?.name || "Vibbe Member"}
											</h3>
											<p className="text-xs text-[#71717A] truncate">
												{user?.email}
											</p>
										</div>
									</div>

									<div className="py-4 space-y-1 text-xs font-semibold uppercase tracking-wider text-[#333333]">
										<Link
											href="/orders"
											onClick={() =>
												setProfileModalOpen(false)
											}
											className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-[#fafafa] transition-colors"
										>
											<Package className="w-4 h-4 text-[#000000]" />
											<span>Order History</span>
										</Link>
										<Link
											href="/favorites"
											onClick={() =>
												setProfileModalOpen(false)
											}
											className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-[#fafafa] transition-colors"
										>
											<Heart className="w-4 h-4 text-[#000000]" />
											<span>
												My Wishlist ({favoritesCount})
											</span>
										</Link>
										<Link
											href="/dashboard"
											onClick={() =>
												setProfileModalOpen(false)
											}
											className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-[#fafafa] transition-colors"
										>
											<LayoutDashboard className="w-4 h-4 text-[#000000]" />
											<span>Dashboard</span>
										</Link>
									</div>

									<div className="pt-3 border-t border-[#e5e7eb]">
										<button
											type="button"
											onClick={handleSignOut}
											className="w-full flex items-center justify-center gap-2 h-10 text-xs font-bold uppercase tracking-wider text-[#d95338] border border-[#e5e7eb] hover:border-[#d95338] hover:bg-[#fff5f5] transition-colors cursor-pointer"
										>
											<LogOut className="w-4 h-4" />
											<span>Sign Out</span>
										</button>
									</div>
								</div>
							) : (
								/* Unauthenticated State */
								<div className="text-center pt-2">
									<div className="w-12 h-12 mx-auto rounded-full bg-[#f4f4f5] flex items-center justify-center mb-3">
										<User className="w-6 h-6 text-[#111111]" />
									</div>
									<h3
										id="profile-modal-title"
										className="text-base font-black uppercase text-[#000000] tracking-tight"
									>
										Join The Rotation
									</h3>
									<p className="text-xs text-[#555555] mt-1 mb-6 leading-relaxed">
										Sign in to track orders, persist your
										bag across devices, and unlock drop
										notifications.
									</p>

									<div className="space-y-2.5">
										{/* Google Direct Sign-In Button */}
										<button
											type="button"
											onClick={handleGoogleSignIn}
											disabled={googleLoading}
											className="w-full h-11 bg-white border border-[#e5e7eb] hover:border-[#000000] text-[#111111] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-colors cursor-pointer disabled:opacity-60"
										>
											{googleLoading ? (
												<Loader2 className="w-4 h-4 animate-spin text-[#111111]" />
											) : (
												<svg
													className="w-4 h-4 shrink-0"
													viewBox="0 0 24 24"
												>
													<path
														fill="#4285F4"
														d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
													/>
													<path
														fill="#34A853"
														d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
													/>
													<path
														fill="#FBBC05"
														d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
													/>
													<path
														fill="#EA4335"
														d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
													/>
												</svg>
											)}
											<span>Continue with Google</span>
										</button>

										{/* Redirect to /auth for Email Auth */}
										<Link
											href="/auth"
											onClick={() =>
												setProfileModalOpen(false)
											}
											className="w-full h-11 bg-[#000000] text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#222222] transition-colors"
										>
											<Mail className="w-4 h-4" />
											<span>Continue with Email</span>
										</Link>

										<button
											type="button"
											onClick={() =>
												setProfileModalOpen(false)
											}
											className="w-full h-9 text-[#71717A] text-[11px] font-bold uppercase tracking-wider hover:text-[#000000] transition-colors cursor-pointer"
										>
											Continue Browsing
										</button>
									</div>
								</div>
							)}
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</>
	);
}