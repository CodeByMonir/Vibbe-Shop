import { requireRole } from "@/lib/core";

const doctorLayout = async ({ children }) => {
	await requireRole("user");
	return children;
};

export default doctorLayout;
