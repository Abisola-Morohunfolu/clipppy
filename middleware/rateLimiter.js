import rateLimit from 'express-rate-limit'

export const globalRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: {
		message: 'Too many requests from this IP, please try again later'
	},
	standardHeaders: true,
	legacyHeaders: false
})

export const clipCreationLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	message: {
		message: 'Too many clip creation requests, please try again later'
	},
	standardHeaders: true,
	legacyHeaders: false
})

export const downloadLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 30,
	message: {
		message: 'Too many download requests, please try again later'
	},
	standardHeaders: true,
	legacyHeaders: false
})
