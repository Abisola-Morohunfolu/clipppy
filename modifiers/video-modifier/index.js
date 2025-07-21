const YTDlpWrap = require('yt-dlp-wrap').default
const path = require('path');
const fs = require('fs');

const YT_DOWNLOAD_PATH = path.join(__dirname, 'bin', 'yt-dlp')
const DOWNLOAD_DIR = path.resolve(__dirname, 'downloads');

const init = () => {
    const downloadVersion = makeDownloadVersion()
    const createDownloadDir = makeCreateDownloadDir()
    const fetchVideo = makeFetchVideo()

    return {
        downloadVersion,
        createDownloadDir,
        fetchVideo
    }
}


const makeDownloadVersion = () => async () => {
    try {
        await YTDlpWrap.downloadFromGithub(
            YT_DOWNLOAD_PATH,
            '2025.06.30',
        );
        console.log('Download yt-dlp bin done.');
    } catch (error) {
        console.error(error)
    }
}

const makeCreateDownloadDir = () => async () => {
        try {
            fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
        } catch (err) {
            console.error('[ERROR] Could not create download directory:', err.message);
            throw err;
        }
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


const makeFetchVideo = () => async ({url,start, end}) => {
    const ytDlpWrap = new YTDlpWrap(YT_DOWNLOAD_PATH)

    let videoUrl = url.replace('https://', 'http://')
    videoUrl = videoUrl.replace('twitter.com', 'x.com');

    // global safety nets
    process.on('uncaughtException', err => {
        console.error('[FATAL] Uncaught Exception:', err);
        process.exit(1);
    });
    process.on('unhandledRejection', (reason, p) => {
        console.error('[FATAL] Unhandled Rejection:', reason, 'promise:', p);
        process.exit(1);
    });

    let emitter;
    const fileName = `${DOWNLOAD_DIR}/${createRandomKey(10)}.mp4`
    try {
        emitter = await ytDlpWrap.execPromise([videoUrl, '-f', '', '-o', fileName]);
    } catch (startErr) {
        console.error('[ERROR] Failed to start yt-dlp process:', startErr.message);
        return {isSuccess: false};
    }

    emitter
        .on('progress', ({ percent, totalSize, currentSpeed, eta }) => {
            console.log(
                `[PROGRESS] ${percent}% — ${(
                    totalSize / (1024 * 1024)
                ).toFixed(2)} MB @ ${(currentSpeed / 1024).toFixed(1)} KiB/s, ETA ${eta}s`
            );
        })
        .on('ytDlpEvent', (eventType, eventData) => {
            console.log(`[EVENT] ${eventType}`, eventData);
        })
        .on('error', (err) => {
            console.error('[ERROR] yt-dlp encountered an error:', err.message || err);
            // TODO: implement retry logic or cleanup here
        })
        .on('close', (code, signal) => {
            if (signal) {
                console.warn(`[WARN] Process was killed with signal: ${signal}`);
            } else if (code === 0) {
                console.log('[SUCCESS] Download completed successfully.');
            } else {
                console.error(`[ERROR] yt-dlp exited with code ${code}`);
            }
        });

    return {
        isSuccess: true,
        file_name: fileName
    }
}

Object.assign(module.exports, {
    init
})