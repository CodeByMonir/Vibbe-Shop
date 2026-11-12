"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
	Search,
	Package,
	CheckCircle2,
	Clock,
	BadgeCheck,
	XCircle,
	ChevronDown,
	ChevronUp,
	ArrowUpRight,
	MapPin,
	CreditCard,
} from "lucide-react";
import { useFetch } from "@/components/hooks/useFetch";

const STATUS_TABS = ["all", "pending", "confirmed", "recheived", "cancelled"];

export default function UserOrdersClient() {
	const { data: ordersData, loading, error } = useFetch("/data/orders.json");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [expandedOrderId, setExpandedOrderId] = useState("VB-9042");

	const orders = useMemo(
		() => (Array.isArray(ordersData) ? ordersData : []),
		[ordersData],
	);

	const filteredOrders = useMemo(() => {
		return orders.filter((order) => {
			const orderStatus = (order.status || "").toLowerCase();
			const matchesStatus =
				selectedStatus === "all" || orderStatus === selectedStatus;
			const query = searchQuery.trim().toLowerCase();
			const matchesSearch =
				!query ||
				order.id.toLowerCase().includes(query) ||
				order.items?.some((item) =>
					item.name.toLowerCase().includes(query),
				);

			return matchesStatus && matchesSearch;
		});
	}, [orders, selectedStatus, searchQuery]);

	const toggleExpand = (orderId) => {
		setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
	};

	const getStatusBadge = (status) => {
		const normalized = (status || "").toLowerCase();

		switch (normalized) {
			case "recheived":
				return (
					<span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60">
						<CheckCircle2 className="w-3 h-3" />
						{status}
					</span>
				);
			case "confirmed":
				return (
					<span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200/60">
						<BadgeCheck className="w-3 h-3" />
						{status}
					</span>
				);
			case "pending":
				return (
					<span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/60">
						<Clock className="w-3 h-3" />
						{status}
					</span>
				);
			case "cancelled":
			default:
				return (
					<span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200/60">
						<XCircle className="w-3 h-3" />
						{status}
					</span>
				);
		}
	};

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
				<div>
					<span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
						Purchases & Shipments
					</span>
					<h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
						Order History
					</h1>
					<p className="text-sm text-neutral-500 mt-1">
						Inspect past orders, track active shipments, and review
						itemized receipts.
					</p>
				</div>

				<Link
					href="/"
					className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors self-start sm:self-auto"
				>
					Browse Store
					<ArrowUpRight className="w-3.5 h-3.5" />
				</Link>
			</div>

			{/* Filter Tabs & Search Bar */}
			<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
				{/* Status Filter Pills */}
				<div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
					{STATUS_TABS.map((status) => {
						const active = selectedStatus === status;
						return (
							<button
								key={status}
								type="button"
								onClick={() => setSelectedStatus(status)}
								className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap border ${
									active
										? "bg-neutral-900 text-white border-neutral-900"
										: "bg-white/70 text-neutral-500 border-neutral-200/80 hover:text-neutral-900 hover:bg-white"
								}`}
							>
								{status}
							</button>
						);
					})}
				</div>

				{/* Search Input */}
				<div className="relative w-full lg:w-72">
					<Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search order ID or item..."
						className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-white/80 border border-neutral-200/80 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
					/>
				</div>
			</div>

			{/* Loading / Error / Orders List */}
			{loading ? (
				<div className="space-y-4">
					{[1, 2, 3].map((n) => (
						<div
							key={n}
							className="h-24 border border-white/60 bg-white/60 backdrop-blur-xl animate-pulse"
						/>
					))}
				</div>
			) : error ? (
				<div className="p-8 border border-red-200 bg-red-50/70 text-center">
					<p className="text-xs font-bold uppercase tracking-wider text-red-600">
						Unable to load orders: {error}
					</p>
				</div>
			) : filteredOrders.length === 0 ? (
				<div className="p-12 border border-white/60 bg-white/75 backdrop-blur-xl text-center">
					<div className="w-12 h-12 mx-auto bg-neutral-100 flex items-center justify-center mb-4">
						<Package className="w-6 h-6 text-neutral-400" />
					</div>
					<h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
						No Matching Orders
					</h3>
					<p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
						No orders matched your active filter or search term. Try
						resetting the status tab or searching a different
						keyword.
					</p>
					<button
						type="button"
						onClick={() => {
							setSelectedStatus("all");
							setSearchQuery("");
						}}
						className="mt-4 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
					>
						Reset Filters
					</button>
				</div>
			) : (
				<div className="space-y-4">
					{filteredOrders.map((order) => {
						const isExpanded = expandedOrderId === order.id;

						return (
							<div
								key={order.id}
								className="border border-white/60 bg-white/75 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all"
							>
								{/* Order Summary Row */}
								<div
									onClick={() => toggleExpand(order.id)}
									className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-white/90 transition-colors"
								>
									<div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
										<div>
											<div className="flex items-center gap-2.5">
												<span className="text-sm font-black text-neutral-900">
													{order.id}
												</span>
												{getStatusBadge(order.status)}
											</div>
											<p className="text-xs text-neutral-500 mt-1">
												Placed on {order.date} •{" "}
												{order.items.reduce(
													(sum, item) =>
														sum + item.qty,
													0,
												)}{" "}
												{order.items.length === 1
													? "item"
													: "items"}
											</p>
										</div>
									</div>

									<div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100">
										<div className="text-left md:text-right">
											<span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
												Total Amount
											</span>
											<span className="text-sm font-black text-neutral-900">
												৳{order.total.toLocaleString()}
											</span>
										</div>

										<button
											type="button"
											aria-label={
												isExpanded
													? "Collapse order details"
													: "Expand order details"
											}
											className="p-2 border border-neutral-200/80 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
										>
											{isExpanded ? (
												<ChevronUp className="w-4 h-4" />
											) : (
												<ChevronDown className="w-4 h-4" />
											)}
										</button>
									</div>
								</div>

								{/* Expanded Order Details */}
								<AnimatePresence initial={false}>
									{isExpanded && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{
												height: "auto",
												opacity: 1,
											}}
											exit={{ height: 0, opacity: 0 }}
											transition={{
												duration: 0.22,
												ease: "easeInOut",
											}}
											className="overflow-hidden border-t border-neutral-100"
										>
											<div className="p-5 bg-neutral-50/50 space-y-5">
												{/* Line Items */}
												<div className="divide-y divide-neutral-200/60 border border-neutral-200/70 bg-white">
													{order.items.map(
														(item, index) => (
															<div
																key={index}
																className="p-4 flex items-center justify-between gap-4"
															>
																<div>
																	<p className="text-xs font-bold text-neutral-900">
																		{
																			item.name
																		}
																	</p>
																	<p className="text-[11px] text-neutral-500 mt-0.5">
																		Variant:{" "}
																		{
																			item.variant
																		}{" "}
																		• Qty:{" "}
																		{
																			item.qty
																		}
																	</p>
																</div>
																<span className="text-xs font-bold text-neutral-900 shrink-0">
																	৳
																	{(
																		item.price *
																		item.qty
																	).toLocaleString()}
																</span>
															</div>
														),
													)}
												</div>

												{/* Shipping, Payment & Cost Breakdown */}
												<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
													<div className="p-4 border border-neutral-200/70 bg-white space-y-1.5">
														<span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
															<MapPin className="w-3.5 h-3.5 text-neutral-900" />
															Shipping & Tracking
														</span>
														<p className="font-semibold text-neutral-800">
															{
																order.shippingAddress
															}
														</p>
														<p className="text-[11px] text-neutral-500">
															Tracking:{" "}
															<span className="font-mono font-semibold text-neutral-800">
																{
																	order.trackingNumber
																}
															</span>
														</p>
													</div>

													<div className="p-4 border border-neutral-200/70 bg-white space-y-1.5">
														<span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
															<CreditCard className="w-3.5 h-3.5 text-neutral-900" />
															Payment Info
														</span>
														<p className="font-semibold text-neutral-800">
															{
																order.paymentMethod
															}
														</p>
														<p className="text-[11px] text-neutral-500">
															Subtotal: ৳
															{order.subtotal.toLocaleString()}{" "}
															• Shipping:{" "}
															<span className="uppercase font-semibold text-emerald-700">
																{order.shipping}
															</span>
														</p>
													</div>

													<div className="p-4 border border-neutral-200/70 bg-white flex flex-col justify-between gap-2">
														<span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
															Order Summary
														</span>
														<div className="flex items-center justify-between pt-2 border-t border-neutral-100">
															<span className="text-xs font-semibold text-neutral-500">
																Grand Total
															</span>
															<span className="text-base font-black text-neutral-900">
																৳
																{order.total.toLocaleString()}
															</span>
														</div>
													</div>
												</div>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
