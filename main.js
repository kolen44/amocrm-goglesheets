import dotenv from 'dotenv'
import { createWebhook } from './amocrm/createWebhook.js'
import { getAccessToken } from './amocrm/tokenManager.js'
dotenv.config()

async function main() {
	try {
		const token = await getAccessToken()
		await createWebhook(token)
	} catch (err) {
		console.error('Ошибка в основном процессе:', err.message)
	}
}

main()
