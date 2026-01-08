export const createClip = (context) => async (req, res, next) => {
	try {
		const { video_url: videoUrl, start, end } = req.body

		const processOptions = {
			url: videoUrl,
			...(start !== null && start !== undefined && { start }),
			...(end !== null && end !== undefined && { end })
		}

		const { isSuccess, fileName, message } = await context.modifiers.videoModifier.downloadAndClipVideo(
			processOptions
		)

		if (!isSuccess) {
			return res.status(400).json({
				success: false,
				message: message || 'Error downloading and clipping video'
			})
		}

		return res.status(200).json({
			success: true,
			file_name: fileName
		})
	} catch (error) {
		next(error)
	}
}
