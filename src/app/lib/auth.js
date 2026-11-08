import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_DB_URI;
if (!uri) {
	throw new Error("Missing MONGO_DB_URI in environment variables.");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
	if (!global._mongoClientPromise) {
		client = new MongoClient(uri);
		global._mongoClientPromise = client.connect();
	}
	clientPromise = global._mongoClientPromise;
} else {
	client = new MongoClient(uri);
	clientPromise = client.connect();
}

const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
	secret: process.env.BETTER_AUTH_SECRET,
	baseURL: process.env.BASE_URL,
	basePath: "/api/auth",
	emailAndPassword: {
		enabled: true,
		// autoSignIn: true,
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		},
	}, // Define custom user schema fields and defaults
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
	database: mongodbAdapter(db, {
		client,
	}),
});
