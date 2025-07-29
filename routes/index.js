const { getVideo } = require('../controllers')
const bodyParser = require('body-parser')

const setupAppRouter = async ({ context, router }) => {
	router.post('/download', bodyParser.json(), getVideo(context))

	return router
}

Object.assign(module.exports, {
	setupAppRouter
})