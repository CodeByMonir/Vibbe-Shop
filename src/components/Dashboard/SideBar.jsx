"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
	LayoutDashboard,
	ShoppingBag,
	Package,
	Users,
	ShieldCheck,
	Settings,
	Heart,
	FileText,
	LogOut,
	ChevronLeft,
	Sliders,
	Bell,
	CreditCard,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authClient } from "@/lib/auth-client";

// Role-specific navigation registry
const ROLE_NAV_CONFIG = {
	admin: [
		{ name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
		{
			name: "User Management",
			href: "/dashboard/admin/users",
			icon: Users,
		},
		{
			name: "Product Catalog",
			href: "/dashboard/admin/products",
			icon: Package,
		},
		{
			name: "Order Processing",
			href: "/dashboard/admin/orders",
			icon: ShoppingBag,
		},
		{
			name: "Moderation Queue",
			href: "/dashboard/admin/moderation",
			icon: ShieldCheck,
		},
		{ name: "System Logs", href: "/dashboard/admin/logs", icon: FileText },
		{
			name: "Store Settings",
			href: "/dashboard/admin/settings",
			icon: Settings,
		},
	],
	moderator: [
		{
			name: "Overview",
			href: "/dashboard/moderator",
			icon: LayoutDashboard,
		},
		{
			name: "Product Approvals",
			href: "/dashboard/moderator/products",
			icon: Package,
		},
		{
			name: "Review Queue",
			href: "/dashboard/moderator/reviews",
			icon: ShieldCheck,
		},
		{
			name: "Order Inquiries",
			href: "/dashboard/moderator/orders",
			icon: ShoppingBag,
		},
		{
			name: "Notifications",
			href: "/dashboard/moderator/notifications",
			icon: Bell,
		},
	],
	user: [
		{ name: "My Account", href: "/dashboard/user", icon: LayoutDashboard },
		{
			name: "Order History",
			href: "/dashboard/user/orders",
			icon: ShoppingBag,
		},
		{ name: "Wishlist", href: "/dashboard/user/wishlist", icon: Heart },
		{
			name: "Payment Methods",
			href: "/dashboard/user/payments",
			icon: CreditCard,
		},
		{
			name: "Account Settings",
			href: "/dashboard/user/settings",
			icon: Sliders,
		},
	],
};

export default function DashboardSidebar() {
	const pathname = usePathname();
	const { user } = useAuth();
	const [collapsed, setCollapsed] = useState(false);

	// Normalize role, default to standard "user"
	const currentRole = (user?.role || "user").toLowerCase();

	// Pick menu corresponding to role
	const navItems = useMemo(() => {
		return ROLE_NAV_CONFIG[currentRole] || ROLE_NAV_CONFIG.user;
	}, [currentRole]);

	const handleSignOut = async () => {
		try {
			await authClient.signOut();
			redirect("/login");
		} catch (err) {
			console.error("Sign out error:", err);
		}
	};

	return (
		<motion.aside
			animate={{ width: collapsed ? 80 : 260 }}
			transition={{ duration: 0.22, ease: "easeInOut" }}
			className="relative flex flex-col justify-between h-screen sticky top-0 border-r border-white/60 bg-white/75 backdrop-blur-xl shadow-[4px_0_24px_0_rgba(0,0,0,0.02)] z-30 select-none shrink-0 max-md:!w-16"
		>
			{/* Top Section */}
			<div>
				{/* Brand / Logo Header */}
				<div className="flex items-center justify-between h-16 px-4 max-md:px-2 border-b border-gray-100">
					{collapsed ? (
						<button
							type="button"
							onClick={() => setCollapsed(false)}
							className="flex items-center justify-center w-full focus:outline-none"
							aria-label="Expand sidebar"
						>
							<div className="relative w-8 h-8 shrink-0 overflow-hidden">
								<Image
									src="/img/logo/vibbeLogo.png"
									alt="Vibbe"
									fill
									sizes="32px"
									className="object-contain"
									priority
								/>
							</div>
						</button>
					) : (
						<Link
							href="/"
							className="flex items-center gap-2.5 overflow-hidden transition-all max-md:justify-center max-md:w-full"
						>
							<div className="relative w-8 h-8 shrink-0 overflow-hidden">
								<Image
									src="/img/logo/vibbeLogo.png"
									alt="Vibbe"
									fill
									sizes="32px"
									className="object-contain"
									priority
								/>
							</div>
							<span className="text-base font-black tracking-tight uppercase text-neutral-900 max-md:hidden">
								Vibbe
							</span>
						</Link>
					)}

					{!collapsed && (
						<button
							type="button"
							onClick={() => setCollapsed(true)}
							className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors max-md:hidden"
							aria-label="Collapse sidebar"
						>
							<ChevronLeft className="w-4 h-4" />
						</button>
					)}
				</div>

				{/* User Role Card */}
				<div className="p-3 max-md:p-1 max-md:hidden">
					<div
						className={`flex items-center gap-3 p-2.5 border border-neutral-200/70 bg-white/60 backdrop-blur-sm ${
							collapsed ? "justify-center" : ""
						}`}
					>
						<div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
							{user?.name
								? user.name.charAt(0).toUpperCase()
								: "U"}
						</div>

						{!collapsed && (
							<div className="overflow-hidden min-w-0">
								<p className="text-xs font-bold text-neutral-900 truncate">
									{user?.name || "Authenticated"}
								</p>
								<div className="flex items-center gap-1.5 mt-0.5">
									<span
										className={`inline-block w-1.5 h-1.5 rounded-full ${
											currentRole === "admin"
												? "bg-rose-500"
												: currentRole === "moderator"
													? "bg-amber-500"
													: "bg-emerald-500"
										}`}
									/>
									<span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
										{currentRole}
									</span>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Dynamic Navigation Items */}
				<nav className="px-2 mt-2 space-y-1 max-md:px-1 max-md:mt-1 max-md:space-y-0.5">
					{navItems.map((item) => {
						const Icon = item.icon;
						// Match exact path for dashboard root, or prefix for subpages
						const isActive =
							pathname === item.href ||
							(item.href !== `/dashboard/${currentRole}` &&
								pathname.startsWith(item.href));

						return (
							<Link
								key={item.href}
								href={item.href}
								className={`relative flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors max-md:justify-center max-md:px-2 max-md:py-2 ${
									isActive
										? "text-neutral-900"
										: "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/70"
								} ${collapsed ? "justify-center" : ""}`}
								title={item.name}
							>
								{isActive && (
									<motion.div
										layoutId="activeTabBadge"
										transition={{
											type: "spring",
											stiffness: 450,
											damping: 35,
										}}
										className="absolute inset-0 bg-neutral-900/5 border-l-2 border-neutral-900"
									/>
								)}
								<Icon className="w-4 h-4 shrink-0 relative z-10" />
								{!collapsed && (
									<span className="relative z-10 truncate max-md:hidden">
										{item.name}
									</span>
								)}
							</Link>
						);
					})}
				</nav>
			</div>

			{/* Bottom Actions */}
			<div className="p-2 border-t border-gray-100 space-y-1 max-md:p-1 max-md:space-y-0.5">
				<button
					type="button"
					onClick={handleSignOut}
					className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-red-600 hover:bg-red-50/70 transition-colors max-md:justify-center max-md:px-2 max-md:py-2 ${
						collapsed ? "justify-center" : ""
					}`}
					title="Sign Out"
				>
					<LogOut className="w-4 h-4 shrink-0" />
					{!collapsed && (
						<span className="max-md:hidden">Sign Out</span>
					)}
				</button>
			</div>
		</motion.aside>
	);
}
