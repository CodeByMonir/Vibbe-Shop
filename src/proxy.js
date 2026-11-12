import { NextResponse } from "next/server";

export async function proxy(request) {
	const { pathname, origin } = request.nextUrl;

	// 1. Fetch active session from Better Auth API using incoming cookies
	let session = null;
	try {
		const res = await fetch(`${origin}/api/auth/get-session`, {
			headers: {
				cookie: request.headers.get("cookie") || "",
			},
		});

		if (res.ok) {
			session = await res.json();
		}
	} catch (error) {
		console.error("Proxy session fetch error:", error);
	}

	const user = session?.user || null;
	const role = (user?.role || "user").toLowerCase();

	// 2. Redirect logged-in users away from auth/login pages
	if (pathname.startsWith("/auth")) {
		if (user) {
			return NextResponse.redirect(new URL(`/dashboard/${role}`, origin));
		}
		return NextResponse.next();
	}

	// 3. Protect all /dashboard routes
	if (pathname.startsWith("/dashboard")) {
		// Unauthenticated visitors go to login
		if (!user) {
			const loginUrl = new URL("/auth", origin);
			loginUrl.searchParams.set("callbackUrl", pathname);
			return NextResponse.redirect(loginUrl);
		}

		// Handle root /dashboard entry redirect
		if (pathname === "/dashboard") {
			return NextResponse.redirect(new URL(`/dashboard/${role}`, origin));
		}

		// Role-based segment guards
		if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
			return NextResponse.redirect(new URL("/unauthorized", origin));
		}

		if (
			pathname.startsWith("/dashboard/moderator") &&
			role !== "moderator" &&
			role !== "admin"
		) {
			return NextResponse.redirect(new URL("/unauthorized", origin));
		}

		if (pathname.startsWith("/dashboard/user") && !user) {
			return NextResponse.redirect(new URL("/auth", origin));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/auth"],
};
