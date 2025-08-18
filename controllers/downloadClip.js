const fs = require('fs')

const downloadClip = (context) => async (req, res) => {
	try {
		const { fileName } = req.params

		if (!fileName) {
			return res.status(400).json({
				message: 'Filename parameter is required'
			})
		}

		const { isSuccess, data, message } = await context.modifiers.videoModifier.getVideoFile({ fileName })

		if (!isSuccess) {
			return res.status(400).json({
				message
			})
		}

		// Set appropriate headers for file download
		res.setHeader('Content-Type', 'video/mp4')
		res.setHeader('Content-Length', data.fileSize)
		res.setHeader('Content-Disposition', `attachment; filename="${data.fileName}"`)
		res.setHeader('Cache-Control', 'no-cache')

		const fileStream = fs.createReadStream(data.filePath)

		fileStream.on('error', (error) => {
			console.error('[ERROR] File stream error:', error.message)

			if (!res.headersSent) {
				res.status(500).json({
					success: false,
					error: 'Error reading file'
				})
			}
		})

		fileStream.on('end', () => {
			console.log(`[INFO] File ${data.fileName} downloaded successfully`)
		})

		fileStream.pipe(res)
	} catch (error) {
		console.error('[ERROR] Download clip error:', error.message)

		if (!res.headersSent) {
			res.status(500).json({
				message: 'Internal server error'
			})
		}
	}
}

module.exports = {
	downloadClip
}
