export const validateClipCreation = (req, res, next) => {
	const { video_url: videoUrl, start, end } = req.body || {}

	if (!videoUrl) {
		return res.status(400).json({
			success: false,
			message: 'Video URL is required'
		})
	}

	if (start !== undefined && start !== null && (typeof start !== 'number' || start < 0)) {
		return res.status(400).json({
			success: false,
			message: 'Start time must be a positive number'
		})
	}

	if (end !== undefined && end !== null && (typeof end !== 'number' || end < 0)) {
		return res.status(400).json({
			success: false,
			message: 'End time must be a positive number'
		})
	}

	if (
		start !== undefined && start !== null &&
		end !== undefined && end !== null &&
		start >= end
	) {
		return res.status(400).json({
			success: false,
			message: 'End time must be greater than start time'
		})
	}

	next()
}

export const validateDownload = (req, res, next) => {
	const { fileName } = req.params

	if (!fileName) {
		return res.status(400).json({
			success: false,
			message: 'Filename parameter is required'
		})
	}

	if (!/^[\w.-]+$/.test(fileName)) {
		return res.status(400).json({
			success: false,
			message: 'Invalid filename format'
		})
	}

	next()
}
