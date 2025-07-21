const getVideo = (context) => async (req, res) => {
    const { video_url } = req.body || {}

    if (!video_url) {
       return res.status(400).json({ message: 'Video url is required' });
    }

    const {isSuccess, file_name} = await context.modifiers.videoModifier.fetchVideo({url: video_url})

    if (!isSuccess) {
       return res.status(400).json({
            message: 'Error downloading video',
        })
    }

    return res.status(200).json({
        file_name,
    })
}

Object.assign(module.exports, {getVideo})