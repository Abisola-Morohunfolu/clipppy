import fs from 'node:fs'

export const downloadClip = (context) => async (req, res, next) => {
	try {
		const { fileName } = req.params

		const { isSuccess, data, message } = await context.modifiers.videoModifier.getVideoFile({ fileName })

		if (!isSuccess) {
			return res.status(400).json({
				success: false,
				message
			})
		}

		res.setHeader('Content-Type', 'video/mp4')
		res.setHeader('Content-Length', data.fileSize)
		res.setHeader('Content-Disposition', `attachment; filename="${data.fileName}"`)
		res.setHeader('Cache-Control', 'no-cache')

		const fileStream = fs.createReadStream(data.filePath)

		fileStream.on('error', (error) => {
			console.error('[ERROR] File stream error:', error.message)
			if (!res.headersSent) {
				next(error)
			}
		})

		fileStream.on('end', () => {
			console.log(`[INFO] File ${data.fileName} downloaded successfully`)
		})

		fileStream.pipe(res)
	} catch (error) {
		next(error)
	}
}