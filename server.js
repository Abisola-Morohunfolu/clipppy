import express from 'express'
import bodyParser from 'body-parser'
import http from 'node:http'
import { init } from './modifiers/video-modifier/index.js'
import { setupAppRouter } from './routes/index.js'
import { corsMiddleware, globalRateLimiter, errorHandler } from './middleware/index.js'

process.on('uncaughtException', (err) => {
	console.error('[FATAL] Uncaught Exception:', err)
	process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
	console.error('[FATAL] Unhandled Rejection:', reason, 'promise:', promise)
	process.exit(1)
})

export const start = async ({ port }) => {
	const app = express()
	const router = express.Router()

	const videoModifier = init()
	await videoModifier.createDownloadDir()

	const context = {
		modifiers: {
			videoModifier
		}
	}

	app.use(corsMiddleware)
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(globalRateLimiter)

	await setupAppRouter({ context, router })
	app.use('/', router)

	app.use((req, res) => {
		res.status(404).json({
			success: false,
			message: 'Route not found'
		})
	})

	app.use(errorHandler)

	const httpServer = http.createServer(app)

	try {
		httpServer.listen(port, () => {
			console.log(`Server started at http://localhost:${port}`)
		})
	} catch (err) {
		console.error('Failed to start server:', err)
	}
}