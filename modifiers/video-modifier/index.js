import YTDlpWrap from 'yt-dlp-wrap'
import path from 'node:path'
import { promises as fsPromises } from 'node:fs'
import { fileURLToPath } from 'node:url'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const YT_DOWNLOAD_PATH = path.join(__dirname, 'bin', 'yt-dlp')
const DOWNLOAD_DIR = path.resolve(__dirname, 'downloads')
const BIN_DIR = path.resolve(__dirname, 'bin')
const YTDlpWrapClass = YTDlpWrap.default || YTDlpWrap

export const init = () => {
	ffmpeg.setFfmpegPath(ffmpegPath)

	const downloadVersion = makeDownloadVersion()
	const createDownloadDir = makeCreateDownloadDir()
	const clipVideo = makeClipVideo(ffmpeg)
	const downloadAndClipVideo = makeDownloadAndClipVideo(clipVideo)
	const getVideoFile = makeGetVideoFile()

	return {
		downloadVersion,
		createDownloadDir,
		downloadAndClipVideo,
		getVideoFile,
		downloadDir: DOWNLOAD_DIR
	}
}

const createBinDir = () => async () => {
	try {
		await fsPromises.mkdir(BIN_DIR, { recursive: true })
	} catch (err) {
		console.error('[ERROR] Could not create download directory:', err.message)
		throw err
	}
}

const makeDownloadVersion = () => async () => {
	try {
		await createBinDir()
		await YTDlpWrapClass.downloadFromGithub(
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
		await fsPromises.mkdir(DOWNLOAD_DIR, { recursive: true })
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
	const ytDlpWrap = new YTDlpWrapClass(YT_DOWNLOAD_PATH)

	let videoUrl = url.replace('https://', 'http://')

	videoUrl = videoUrl.replace('twitter.com', 'x.com')

	const filenameKey = createRandomKey(10)
	let fileName = `${filenameKey}.mp4`
	const fileNameWithPath = `${DOWNLOAD_DIR}/${fileName}`

	try {
		await ytDlpWrap.execPromise(['--no-check-certificate', videoUrl, '-o', fileNameWithPath])

		if (start !== undefined || end !== undefined) {
			const clippedFileName = `clipped_${filenameKey}.mp4`
			const clippedFilePath = `${DOWNLOAD_DIR}/${clippedFileName}`

			await clipVideo(fileNameWithPath, clippedFilePath, start || 0, end)

			await fsPromises.unlink(fileNameWithPath).catch(() => {})
			fileName = clippedFileName
		}
	} catch (startErr) {
		console.error('[ERROR] Failed to process video:', startErr.message)

		return { isSuccess: false, message: startErr.message }
	}

	return {
		isSuccess: true,
		fileName
	}
}

const makeGetVideoFile = () => async ({ fileName }) => {
	try {
		const filePath = path.join(DOWNLOAD_DIR, fileName)

		const stats = await fsPromises.stat(filePath)

		return {
			isSuccess: true,
			data: {
				filePath,
				fileName,
				fileSize: stats.size,
				created: stats.birthtime
			}
		}
	} catch (error) {
		if (error.code === 'ENOENT') {
			return { isSuccess: false, message: 'File not found' }
		}

		console.error('[ERROR] Failed to get video file:', error.message)

		return { isSuccess: false, message: error.message }
	}
}
