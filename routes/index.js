const { createClip, downloadClip } = require('../controllers')
const bodyParser = require('body-parser')

const setupAppRouter = async ({ context, router }) => {
	router.post('/clips/create', bodyParser.json(), createClip(context))
	router.get('/clips/:fileName', bodyParser.json(), downloadClip(context))

	return router
}

Object.assign(module.exports, {
	setupAppRouter
})