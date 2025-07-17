const YTDlpWrap = require('yt-dlp-wrap').default
const path = require('path');

const YT_DOWNLOAD_PATH = path.join(__dirname, 'bin', 'yt-dlp')

const init = () => {
    const downloadVersion = makeDownloadVersion()

    return {
        downloadVersion,
    }
}


const makeDownloadVersion = () => async () => {
    try {
        await YTDlpWrap.downloadFromGithub(
            YT_DOWNLOAD_PATH,
            '2025.06.25',
        );
        console.log('Download yt-dlp bin done.');
    } catch (error) {
        console.error(error)
    }
}

const makeDownloadFolder = () => async () => {

}
const makeFetchVideo = () => async ({url,start, end}) => {
    const ytDlpWrap = new YTDlpWrap(YT_DOWNLOAD_PATH)

    const videoUrl = url.replace('twitter.com', 'x.com');

    // global safety nets
    process.on('uncaughtException', err => {
        console.error('[FATAL] Uncaught Exception:', err);
        process.exit(1);
    });
    process.on('unhandledRejection', (reason, p) => {
        console.error('[FATAL] Unhandled Rejection:', reason, 'promise:', p);
        process.exit(1);
    });


}

Object.assign(module.exports, {
    init
})