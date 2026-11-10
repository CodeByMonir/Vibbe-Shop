import DashboardSidebar from "@/components/Dashboard/SideBar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserLayout({ children }) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/auth");
	}

	return (
		<div className="min-h-screen bg-[#fafafa] flex font-sans selection:bg-neutral-900 selection:text-white">
			<DashboardSidebar />
			<main className="flex-1 p-6 md:p-10 overflow-y-auto">
				<div className="max-w-6xl mx-auto">{children}</div>
			</main>
		</div>
	);
}
