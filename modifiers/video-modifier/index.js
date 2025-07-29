const YTDlpWrap = require('yt-dlp-wrap').default
const path = require('path')
const fs = require('fs')

const YT_DOWNLOAD_PATH = path.join(__dirname, 'bin', 'yt-dlp')
const DOWNLOAD_DIR = path.resolve(__dirname, 'downloads')

const init = () => {
	const ffmpeg = require('fluent-ffmpeg')
	const ffmpegPath = require('ffmpeg-static')

	ffmpeg.setFfmpegPath(ffmpegPath)

	const downloadVersion = makeDownloadVersion()
	const createDownloadDir = makeCreateDownloadDir()
	const clipVideo = makeClipVideo(ffmpeg)
	const downloadAndClipVideo = makeDownloadAndClipVideo(clipVideo)

	return {
		downloadVersion,
		createDownloadDir,
		downloadAndClipVideo
	}
}

const makeDownloadVersion = () => async () => {
	try {
		await YTDlpWrap.downloadFromGithub(
			YT_DOWNLOAD_PATH,
			'2025.06.30'
		)
		console.log('Download yt-dlp bin done.')
	} catch (error) {
		console.error(error)
	}
}

const makeCreateDownloadDir = () => async () => {
	try {
		fs.mkdirSync(DOWNLOAD_DIR, { recursive: true })
	} catch (err) {
		console.error('[ERROR] Could not create download directory:', err.message)
		throw err
	}
}

const makeClipVideo = (ffmpegLib) => async (inputPath, outputPath, startTime, durationSec) => {
	return new Promise((resolve, reject) => {
		const videoPath = ffmpegLib(inputPath)

		if (durationSec) {
			videoPath.setDuration(durationSec)
		}

		videoPath.setStartTime(startTime)
			.output(outputPath)
			.on('start', cmd => console.log('[FFMPEG] Command:', cmd))
			.on('progress', progress =>
				console.log(
					`[FFMPEG] timemark=${progress.timemark}, frames=${progress.frames}`
				)
			)
			.on('error', err => reject(new Error(`FFmpeg error: ${err.message}`)))
			.on('end', () => resolve())
			.run()
	})
}

const createRandomKey = (keyLength) => {
	const randStringCharset =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	const stringWithCharset = (length, charset) => {
		let result = ''

		for (let i = 0; i < length; i++) {
			result += charset.charAt(Math.floor(Math.random() * charset.length))
		}

		return result
	}

	return stringWithCharset(keyLength, randStringCharset)
}

const makeDownloadAndClipVideo = (clipVideo) => async ({ url, start, end }) => {
	const ytDlpWrap = new YTDlpWrap(YT_DOWNLOAD_PATH)

	let videoUrl = url.replace('https://', 'http://')

	videoUrl = videoUrl.replace('twitter.com', 'x.com')

	// global safety nets
	process.on('uncaughtException', err => {
		console.error('[FATAL] Uncaught Exception:', err)
		process.exit(1)
	})
	process.on('unhandledRejection', (reason, p) => {
		console.error('[FATAL] Unhandled Rejection:', reason, 'promise:', p)
		process.exit(1)
	})

	const filenameKey = createRandomKey(10)

	let fileName = `${filenameKey}.mp4`
	const fileNameWithPath = `${DOWNLOAD_DIR}/${fileName}`

	try {
		await ytDlpWrap.execPromise(['--no-check-certificate', videoUrl, '-o', fileNameWithPath])

		if (start || end) {
			fileName = `clipped_${filenameKey}.mp4`
			await clipVideo(fileNameWithPath, `${DOWNLOAD_DIR}/${fileName}`, start || 0, end)
		}
	} catch (startErr) {
		console.error('[ERROR] Failed to start yt-dlp process:', startErr.message)

		return { isSuccess: false }
	}

	return {
		isSuccess: true,
		fileName
	}
}

Object.assign(module.exports, {
	init
})