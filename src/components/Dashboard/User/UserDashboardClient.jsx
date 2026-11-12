"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
	ShoppingBag,
	CreditCard,
	PackageCheck,
	ArrowUpRight,
	Clock,
	CheckCircle2,
	BadgeCheck,
	XCircle,
	Truck,
} from "lucide-react";
import { useAuth } from "@/components/context/AuthContext";
import { useFetch } from "@/components/hooks/useFetch";

const SLICE_PALETTE = ["#171717", "#525252", "#a3a3a3", "#d4d4d4", "#737373"];

function getCategoryLabel(item) {
	if (item.category) return item.category;
	const name = (item.name || "").toLowerCase();
	if (
		name.includes("tee") ||
		name.includes("shirt") ||
		name.includes("top")
	) {
		return "Apparel & Tops";
	}
	if (
		name.includes("trouser") ||
		name.includes("short") ||
		name.includes("pant")
	) {
		return "Bottoms";
	}
	if (
		name.includes("bag") ||
		name.includes("crossbody") ||
		name.includes("beanie") ||
		name.includes("scarf")
	) {
		return "Accessories";
	}
	if (
		name.includes("shoe") ||
		name.includes("sneaker") ||
		name.includes("boot")
	) {
		return "Footwear";
	}
	return "Store Items";
}

export default function UserDashboardClient() {
	const { user } = useAuth();
	const {
		data: ordersData,
		loading,
		error,
	} = useFetch("/data/orders.json");
	const [hoveredSlice, setHoveredSlice] = useState(null);

	const orders = useMemo(
		() => (Array.isArray(ordersData) ? ordersData : []),
		[ordersData],
	);

	// Exclude cancelled orders from spending analytics
	const validOrders = useMemo(
		() =>
			orders.filter(
				(o) => (o.status || "").toLowerCase() !== "cancelled",
			),
		[orders],
	);

	// Aggregate spending by category dynamically for the Pie Chart
	const spendingBreakdown = useMemo(() => {
		const totalsByCategory = {};

		validOrders.forEach((order) => {
			(order.items || []).forEach((item) => {
				const category = getCategoryLabel(item);
				const lineTotal = (item.price || 0) * (item.qty || 1);
				totalsByCategory[category] =
					(totalsByCategory[category] || 0) + lineTotal;
			});
		});

		return Object.entries(totalsByCategory)
			.map(([label, amount], index) => ({
				label,
				amount,
				color: SLICE_PALETTE[index % SLICE_PALETTE.length],
			}))
			.sort((a, b) => b.amount - a.amount);
	}, [validOrders]);

	const totalSpent = useMemo(
		() => spendingBreakdown.reduce((acc, item) => acc + item.amount, 0),
		[spendingBreakdown],
	);

	const activeShipmentsCount = useMemo(
		() =>
			orders.filter((o) =>
				["pending", "confirmed"].includes(
					(o.status || "").toLowerCase(),
				),
			).length,
		[orders],
	);

	// Top 3 most recent orders
	const recentOrders = useMemo(() => orders.slice(0, 3), [orders]);

	// Calculate Pie Chart SVG geometry
	const radius = 70;
	const circumference = 2 * Math.PI * radius;

	const slices = useMemo(() => {
		if (totalSpent === 0) return [];
		let cumulativePercent = 0;

		return spendingBreakdown.map((item) => {
			const percent = item.amount / totalSpent;
			const strokeDasharray = `${percent * circumference} ${circumference}`;
			const strokeDashoffset = -cumulativePercent * circumference;
			cumulativePercent += percent;

			return {
				...item,
				percent: Math.round(percent * 100),
				strokeDasharray,
				strokeDashoffset,
			};
		});
	}, [spendingBreakdown, totalSpent, circumference]);

	const activeData =
		hoveredSlice !== null && slices[hoveredSlice]
			? slices[hoveredSlice]
			: {
					label: "Total Spend",
					amount: totalSpent,
					percent: totalSpent > 0 ? 100 : 0,
				};

	const renderStatusBadge = (status) => {
		const normalized = (status || "").toLowerCase();

		switch (normalized) {
			case "recheived":
				return (
					<span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60">
						<CheckCircle2 className="w-3 h-3" />
						{status}
					</span>
				);
			case "confirmed":
				return (
					<span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200/60">
						<BadgeCheck className="w-3 h-3" />
						{status}
					</span>
				);
			case "pending":
				return (
					<span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/60">
						<Clock className="w-3 h-3" />
						{status}
					</span>
				);
			case "cancelled":
			default:
				return (
					<span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200/60">
						<XCircle className="w-3 h-3" />
						{status}
					</span>
				);
		}
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
				<div>
					<span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
						Customer Portal
					</span>
					<h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
						Welcome back
						{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
					</h1>
					<p className="text-sm text-neutral-500 mt-1">
						Track order history, review spending insights, and
						manage your account.
					</p>
				</div>

				<Link
					href="/"
					className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors self-start sm:self-auto"
				>
					Continue Shopping
					<ArrowUpRight className="w-3.5 h-3.5" />
				</Link>
			</div>

			{/* KPI Summary Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div className="p-5 border border-white/60 bg-white/75 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
					<div className="flex items-center justify-between text-neutral-400 mb-3">
						<span className="text-[11px] font-bold uppercase tracking-wider">
							Total Orders
						</span>
						<ShoppingBag className="w-4 h-4 text-neutral-900" />
					</div>
					<p className="text-2xl font-black text-neutral-900">
						{loading ? "..." : orders.length}
					</p>
					<p className="text-xs text-neutral-500 mt-1">
						All recorded orders
					</p>
				</div>

				<div className="p-5 border border-white/60 bg-white/75 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
					<div className="flex items-center justify-between text-neutral-400 mb-3">
						<span className="text-[11px] font-bold uppercase tracking-wider">
							Active Orders
						</span>
						<Truck className="w-4 h-4 text-neutral-900" />
					</div>
					<p className="text-2xl font-black text-neutral-900">
						{loading ? "..." : activeShipmentsCount}
					</p>
					<p className="text-xs text-emerald-600 font-medium mt-1">
						Pending & confirmed
					</p>
				</div>

				<div className="p-5 border border-white/60 bg-white/75 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
					<div className="flex items-center justify-between text-neutral-400 mb-3">
						<span className="text-[11px] font-bold uppercase tracking-wider">
							Total Spent
						</span>
						<CreditCard className="w-4 h-4 text-neutral-900" />
					</div>
					<p className="text-2xl font-black text-neutral-900">
						{loading ? "..." : `৳${totalSpent.toLocaleString()}`}
					</p>
					<p className="text-xs text-neutral-500 mt-1">
						Excludes cancelled orders
					</p>
				</div>
			</div>

			{error && (
				<div className="p-4 border border-red-200 bg-red-50/70 text-xs font-bold uppercase tracking-wider text-red-600">
					Failed to load dashboard order analytics: {error}
				</div>
			)}

			{/* Main Content Split: Pie Chart + Recent Orders */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				{/* Interactive Pie Chart Card */}
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className="lg:col-span-5 p-6 border border-white/60 bg-white/75 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between"
				>
					<div>
						<h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">
							Spending by Category
						</h2>
						<p className="text-xs text-neutral-500 mt-0.5">
							Hover over a segment to inspect category share
						</p>
					</div>

					{/* SVG Donut / Pie Chart */}
					<div className="relative flex items-center justify-center my-6">
						{loading ? (
							<div className="w-[190px] h-[190px] rounded-full border-[22px] border-neutral-100 animate-pulse" />
						) : slices.length === 0 ? (
							<div className="w-[190px] h-[190px] rounded-full border-[22px] border-neutral-100 flex items-center justify-center text-xs text-neutral-400 font-semibold">
								No spend data
							</div>
						) : (
							<>
								<svg
									width="190"
									height="190"
									viewBox="0 0 180 180"
									className="-rotate-90 overflow-visible"
								>
									{slices.map((slice, idx) => {
										const isHovered = hoveredSlice === idx;
										return (
											<circle
												key={slice.label}
												cx="90"
												cy="90"
												r={radius}
												fill="transparent"
												stroke={slice.color}
												strokeWidth={
													isHovered ? 26 : 22
												}
												strokeDasharray={
													slice.strokeDasharray
												}
												strokeDashoffset={
													slice.strokeDashoffset
												}
												onMouseEnter={() =>
													setHoveredSlice(idx)
												}
												onMouseLeave={() =>
													setHoveredSlice(null)
												}
												className="transition-all duration-200 cursor-pointer"
											/>
										);
									})}
								</svg>

								{/* Center Readout */}
								<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
									<span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 truncate max-w-[100px]">
										{activeData.label}
									</span>
									<span className="text-base font-black text-neutral-900 mt-0.5">
										৳{activeData.amount.toLocaleString()}
									</span>
									<span className="text-[11px] font-semibold text-neutral-500">
										{activeData.percent}%
									</span>
								</div>
							</>
						)}
					</div>

					{/* Legend */}
					<div className="space-y-2 border-t border-neutral-100 pt-4">
						{slices.map((slice, idx) => (
							<div
								key={slice.label}
								onMouseEnter={() => setHoveredSlice(idx)}
								onMouseLeave={() => setHoveredSlice(null)}
								className={`flex items-center justify-between text-xs p-1.5 transition-colors cursor-pointer ${
									hoveredSlice === idx
										? "bg-neutral-100/80"
										: ""
								}`}
							>
								<div className="flex items-center gap-2">
									<span
										className="w-2.5 h-2.5 shrink-0"
										style={{ backgroundColor: slice.color }}
									/>
									<span className="font-semibold text-neutral-700">
										{slice.label}
									</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-neutral-500">
										৳{slice.amount.toLocaleString()}
									</span>
									<span className="font-bold text-neutral-900 w-8 text-right">
										{slice.percent}%
									</span>
								</div>
							</div>
						))}
					</div>
				</motion.div>

				{/* Recent Orders Table */}
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.08 }}
					className="lg:col-span-7 p-6 border border-white/60 bg-white/75 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between"
				>
					<div>
						<div className="flex items-center justify-between mb-5">
							<div>
								<h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">
									Recent Orders
								</h2>
								<p className="text-xs text-neutral-500 mt-0.5">
									Your latest storefront purchases and
									delivery status
								</p>
							</div>
							<Link
								href="/dashboard/user/orders"
								className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:underline"
							>
								View All
							</Link>
						</div>

						{loading ? (
							<div className="space-y-3">
								{[1, 2, 3].map((n) => (
									<div
										key={n}
										className="h-14 bg-neutral-100/70 animate-pulse"
									/>
								))}
							</div>
						) : recentOrders.length === 0 ? (
							<p className="text-xs text-neutral-500 py-8 text-center">
								No recent orders found.
							</p>
						) : (
							<div className="divide-y divide-neutral-100">
								{recentOrders.map((order) => {
									const firstItem =
										order.items?.[0]?.name || "Order Items";
									const extraCount =
										(order.items?.length || 1) - 1;
									const summaryLabel =
										extraCount > 0
											? `${firstItem} + ${extraCount} more`
											: firstItem;

									return (
										<div
											key={order.id}
											className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
										>
											<div className="space-y-1">
												<div className="flex items-center gap-2">
													<span className="text-xs font-black text-neutral-900">
														{order.id}
													</span>
													<span className="text-[11px] text-neutral-400">
														• {order.date}
													</span>
												</div>
												<p className="text-xs text-neutral-600">
													{summaryLabel}
												</p>
											</div>

											<div className="flex items-center justify-between sm:justify-end gap-4">
												<span className="text-xs font-bold text-neutral-900">
													৳
													{(
														order.total || 0
													).toLocaleString()}
												</span>
												{renderStatusBadge(
													order.status,
												)}
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>

					<div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
						<span className="flex items-center gap-1.5">
							<PackageCheck className="w-4 h-4 text-neutral-900" />
							Free standard shipping active on your account
						</span>
						<Link
							href="/dashboard/user/settings"
							className="font-bold text-neutral-900 hover:underline"
						>
							Manage Addresses
						</Link>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
