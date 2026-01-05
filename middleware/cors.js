import cors from 'cors'

const corsOptions = {
	origin: process.env.CORS_ORIGIN || '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
	maxAge: 86400
}

export const corsMiddleware = cors(corsOptions)
