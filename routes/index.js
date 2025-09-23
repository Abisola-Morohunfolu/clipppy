import {createClip, downloadClip} from '../controllers/index.js'
import bodyParser from 'body-parser';

export const setupAppRouter = async ({ context, router }) => {
	router.post('/clips/create', bodyParser.json(), createClip(context))
	router.get('/clips/:fileName', bodyParser.json(), downloadClip(context))

	return router
}