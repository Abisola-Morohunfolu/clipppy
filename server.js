const express = require('express');
const {setupAppRouter} = require("./routes");
const router = express.Router()

const start = async ({port}) => {
    const app = express();
    app.use(express.json());

    app.use(express.urlencoded({ extended: true }));

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Methods',
            'GET, POST, OPTIONS'
        );
        res.header(
            'Access-Control-Allow-Headers',
            'Content-Type'
        );
        if (req.method === 'OPTIONS') return res.sendStatus(204);
        next();
    });

    const ytDlpLib = require('./modifiers/video-modifier').init()
    await ytDlpLib.downloadVersion()

    const context = {
        modifiers: ytDlpLib
    }

   await setupAppRouter({context, router})

    // Fallback 404
    app.use((req, res) => {
        res.status(404).json({ message: 'Not found' });
    });

    try {
        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        })
    } catch(err) {
        console.error('Failed to start server:', err);
    }
}

Object.assign(module.exports, {
    start
})