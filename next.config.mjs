/** @type {import('next').NextConfig} */
const additionalAllowedOrigins = (process.env.NEXT_SERVER_ACTIONS_ALLOWED_ORIGINS || "")
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

const nextConfig = {
	experimental: {
		serverActions: {
			allowedOrigins: [
				"localhost:3000",
				"127.0.0.1:3000",
				"*.inc1.devtunnels.ms",
				"*.devtunnels.ms",
				...additionalAllowedOrigins,
			],
		},
	},
};

export default nextConfig;
