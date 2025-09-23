import express from 'express';
const router = express.Router()
import https from 'node:http';
import { init } from './modifiers/video-modifier/index.js'
import {setupAppRouter} from "./routes/index.js";

export const start = async ({ port }) => {
	const app = express()

	const videoModifier = init()

	await videoModifier.createDownloadDir()

	const context = {
		modifiers: {
			videoModifier
		}
	}

	await setupAppRouter({ context, router })

	// // Fallback 404
	// app.use((req, res) => {
	//     res.status(404).json({ message: 'Not found' });
	// });

	app.use('/', router)

	const httpsServer = https.createServer(app);

	try {
		httpsServer.listen(port, () => {
			console.log(`Server started at http://localhost:${port}`)
		})
	} catch (err) {
		console.error('Failed to start server:', err)
	}
}