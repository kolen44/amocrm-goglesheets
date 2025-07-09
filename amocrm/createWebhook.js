import { CONFIG } from '../config.js'

export async function createWebhook(accessToken) {
	try {
		const url = `https://${CONFIG.amoDomain}/api/v4/webhooks`

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				destination: CONFIG.redirectUri,
				settings: ['add_lead', 'status_lead', 'add_contact', 'update_lead'],
				sort: 10,
			}),
		})

		if (!response.ok) {
			const errorText = await response.text()
			throw new Error(errorText)
		}

		console.log('Вебхук успешно создан')
	} catch (error) {
		console.error('Ошибка при создании вебхука:', error.message)
	}
}
