const express = require('express');
const {setupAppRouter} = require("./routes");
const router = express.Router()
const https = require("http");
const fs = require("fs");
const certifi = require('certifi');

const start = async ({port}) => {
    const app = express();

    // app.use(bodyParser.json());
    // app.use((req, res, next) => {
    //     let raw = '';
    //     req.on('data', chunk => raw += chunk);
    //     req.on('end', () => {
    //         console.log('> Incoming:', req.method, req.url);
    //         console.log('> Content-Type:', req.headers['content-type']);
    //         console.log('> Raw body:', JSON.stringify(raw));
    //         next();
    //     });
    // });
    // app.use(express.json());
    //
    // app.use(express.urlencoded({ extended: true }));

    // app.use((req, res, next) => {
    //     res.header('Access-Control-Allow-Origin', '*');
    //     res.header(
    //         'Access-Control-Allow-Methods',
    //         'GET, POST, OPTIONS'
    //     );
    //     res.header(
    //         'Access-Control-Allow-Headers',
    //         'Content-Type'
    //     );
    //     if (req.method === 'OPTIONS') return res.sendStatus(204);
    //     next();
    // });



    const videoModifier = require('./modifiers/video-modifier').init()
    // await videoModifier.downloadVersion()
    await videoModifier.createDownloadDir();

    const context = {
        modifiers: {
            videoModifier
        }
    }
    //
    // router.get('/health', (req, res) => {
    //     res.json({ status: 'ok' });
    // });

   await setupAppRouter({context, router})

    // // Fallback 404
    // app.use((req, res) => {
    //     res.status(404).json({ message: 'Not found' });
    // });

    app.use('/', router);

    const httpsServer = https.createServer({
        cert: fs.readFileSync(certifi),
    }, app)

    try {
        httpsServer.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        })
    } catch(err) {
        console.error('Failed to start server:', err);
    }
}

Object.assign(module.exports, {
    start
})