"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, Home, LogIn } from "lucide-react";
import { useAuth } from "@/components/context/AuthContext";

export default function Unauthorized() {
	const router = useRouter();
	const { user, isAuthenticated, loading } = useAuth();

	return (
		<div className="relative min-h-screen flex items-center justify-center p-4 bg-[#fafafa] overflow-hidden selection:bg-black selection:text-white">
			{/* Subtle Background Glow */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-100/40 rounded-full blur-3xl pointer-events-none" />

			{/* Main Glassmorphic Card */}
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.35, ease: "easeOut" }}
				className="relative w-full max-w-md p-8 sm:p-10 border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] text-center"
			>
				<div className="mx-auto w-14 h-14 bg-red-50 border border-red-200/60 flex items-center justify-center mb-6">
					<ShieldAlert className="w-7 h-7 text-red-600" />
				</div>

				<span className="text-[11px] font-bold uppercase tracking-widest text-red-600 block mb-2">
					Error 401 / 403
				</span>
				<h1 className="text-2xl font-black tracking-tight text-neutral-900 mb-3">
					Access Restricted
				</h1>

				<p className="text-sm text-neutral-500 leading-relaxed mb-6">
					You do not possess the required credentials or role
					privileges to view this directory.
				</p>

				{!loading && (
					<div className="mb-8 p-3 border border-neutral-200/80 bg-neutral-50/70 text-left">
						<div className="flex items-center justify-between text-xs">
							<span className="text-neutral-500 font-medium">
								Logged in as:
							</span>
							<span className="font-semibold text-neutral-800 truncate max-w-[180px]">
								{isAuthenticated
									? user?.email
									: "Anonymous Guest"}
							</span>
						</div>
						{isAuthenticated && (
							<div className="flex items-center justify-between text-xs mt-1.5 pt-1.5 border-t border-neutral-200/60">
								<span className="text-neutral-500 font-medium">
									Assigned Role:
								</span>
								<span className="inline-block uppercase tracking-wider text-[10px] font-bold px-1.5 py-0.5 bg-neutral-200 text-neutral-700">
									{user?.role || "user"}
								</span>
							</div>
						)}
					</div>
				)}

				<div className="flex flex-col gap-2.5">
					<Link
						href="/dashboard"
						className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
					>
						<Home className="w-4 h-4" />
						Return to Dashboard
					</Link>

					<div className="grid grid-cols-2 gap-2.5">
						<button
							type="button"
							onClick={() => router.back()}
							className="flex items-center justify-center gap-2 py-2.5 px-3 border border-neutral-200 hover:bg-neutral-100 text-neutral-700 text-xs font-bold uppercase tracking-wider transition-colors"
						>
							<ArrowLeft className="w-3.5 h-3.5" />
							Go Back
						</button>

						{!isAuthenticated ? (
							<Link
								href="/login"
								className="flex items-center justify-center gap-2 py-2.5 px-3 border border-neutral-200 hover:bg-neutral-100 text-neutral-700 text-xs font-bold uppercase tracking-wider transition-colors"
							>
								<LogIn className="w-3.5 h-3.5" />
								Sign In
							</Link>
						) : (
							<Link
								href="/"
								className="flex items-center justify-center gap-2 py-2.5 px-3 border border-neutral-200 hover:bg-neutral-100 text-neutral-700 text-xs font-bold uppercase tracking-wider transition-colors"
							>
								Storefront
							</Link>
						)}
					</div>
				</div>
			</motion.div>
		</div>
	);
}
