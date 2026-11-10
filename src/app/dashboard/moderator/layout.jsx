import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ModeratorLayout({ children }) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/auth");
	}

	const allowedRoles = ["moderator", "admin"];
	if (!allowedRoles.includes(session.user.role)) {
		redirect("/dashboard");
	}

	return <>{children}</>;
}
