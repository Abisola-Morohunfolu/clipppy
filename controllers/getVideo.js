const getVideo = (context) => async (req, res) => {
	const { video_url: videoUrl } = req.body || {}

	if (!videoUrl) {
		return res.status(400).json({ message: 'Video url is required' })
	}

	const { isSuccess, fileName } = await context.modifiers.videoModifier.downloadAndClipVideo({ url: videoUrl })

	if (!isSuccess) {
		return res.status(400).json({
			message: 'Error downloading video'
		})
	}

	return res.status(200).json({
		file_name: fileName
	})
}

Object.assign(module.exports, { getVideo })