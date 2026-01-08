import { createClip, downloadClip } from '../controllers/index.js'
import {
	clipCreationLimiter,
	downloadLimiter,
	validateClipCreation,
	validateDownload
} from '../middleware/index.js'

export const setupAppRouter = async ({ context, router }) => {
	router.post(
		'/clips/create',
		clipCreationLimiter,
		validateClipCreation,
		createClip(context)
	)

	router.get(
		'/clips/:fileName',
		downloadLimiter,
		validateDownload,
		downloadClip(context)
	)

	return router
}
