import { promises as fsPromises } from 'node:fs'
import path from 'node:path'
import cron from 'node-cron'

const MAX_FILE_AGE_MS = 10 * 60 * 1000

export const createCleanupService = (downloadDir) => {
	const cleanupOldFiles = async () => {
		try {
			const files = await fsPromises.readdir(downloadDir)
			const now = Date.now()
			let deletedCount = 0

			for (const file of files) {
				const filePath = path.join(downloadDir, file)

				try {
					const stats = await fsPromises.stat(filePath)

					if (stats.isFile()) {
						const fileAge = now - stats.birthtimeMs

						if (fileAge > MAX_FILE_AGE_MS) {
							await fsPromises.unlink(filePath)
							deletedCount++
							console.log(`[CLEANUP] Deleted old file: ${file} (age: ${Math.round(fileAge / 1000)}s)`)
						}
					}
				} catch (fileErr) {
					console.error(`[CLEANUP] Error processing file ${file}:`, fileErr.message)
				}
			}

			if (deletedCount > 0) {
				console.log(`[CLEANUP] Cleanup completed. Deleted ${deletedCount} file(s)`)
			}
		} catch (err) {
			console.error('[CLEANUP] Error during cleanup:', err.message)
		}
	}

	const startScheduler = () => {
		console.log('[CLEANUP] Starting cleanup scheduler (runs every 5 minutes)')

		cron.schedule('*/5 * * * *', () => {
			console.log('[CLEANUP] Running scheduled cleanup task')
			cleanupOldFiles()
		})

		setImmediate(() => {
			console.log('[CLEANUP] Running initial cleanup')
			cleanupOldFiles()
		})
	}

	return {
		cleanupOldFiles,
		startScheduler
	}
}
