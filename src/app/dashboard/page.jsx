import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardRootPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/auth");
	}

	const role = session.user.role || "user";

	switch (role) {
		case "admin":
			redirect("/dashboard/admin");
		case "moderator":
			redirect("/dashboard/moderator");
		case "user":
		default:
			redirect("/dashboard/user");
	}
}
