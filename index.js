import { start } from './server.js'

const main = async () => {
	try {
		await start({ port: process.env.PORT || 8000 })
	} catch (err) {
		console.error(err)
	}
}

void main()
