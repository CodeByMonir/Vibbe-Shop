import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_DB_URI;
if (!uri) {
	throw new Error("Missing MONGO_DB_URI in environment variables.");
}

// 1. Maintain a single MongoClient instance across hot reloads in development
let client;

if (process.env.NODE_ENV === "development") {
	if (!global._mongoClient) {
		global._mongoClient = new MongoClient(uri);
	}
	client = global._mongoClient;
} else {
	client = new MongoClient(uri);
}

// 2. Obtain the database reference from the resolved client instance
const db = client.db(process.env.AUTH_DB_NAME);

// 3. Configure Better Auth
export const auth = betterAuth({
	secret: process.env.BETTER_AUTH_SECRET,
	baseURL: process.env.BASE_URL,
	basePath: "/api/auth",
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
		},
	},
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: false,
				defaultValue: "user",
				input: false,
			},
		},
	},
	// Pass the db instance directly into the adapter
	database: mongodbAdapter(db),
});
