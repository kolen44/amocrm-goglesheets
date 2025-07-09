import axios from 'axios'
import { CONFIG } from '../config.js'

let expiresAt = 0 // UNIX timestamp

export async function getAccessToken() {
	let accessToken = CONFIG.accessToken
	let refreshToken = CONFIG.refreshToken
	const now = Math.floor(Date.now() / 1000)
	console.log(refreshToken)

	if (accessToken) {
		return accessToken
	}

	if (refreshToken) {
		try {
			const { data } = await axios.post(
				`${CONFIG.baseUrl}/oauth2/access_token`,
				{
					client_id: CONFIG.clientId,
					client_secret: CONFIG.clientSecret,
					grant_type: 'refresh_token',
					refresh_token: refreshToken,
					redirect_uri: CONFIG.redirectUri,
				}
			)

			accessToken = data.access_token
			refreshToken = data.refresh_token
			expiresAt = now + data.expires_in

			console.log('Токен обновлён через refresh_token')
			return accessToken
		} catch (err) {
			console.warn('Ошибка обновления через refresh_token:', err.message)
		}
	}

	try {
		const { data } = await axios.post(`${CONFIG.baseUrl}/oauth2/access_token`, {
			client_id: CONFIG.clientId,
			client_secret: CONFIG.clientSecret,
			grant_type: 'authorization_code',
			code: CONFIG.authCode,
			redirect_uri: CONFIG.redirectUri,
		})

		accessToken = data.access_token
		refreshToken = data.refresh_token
		expiresAt = now + data.expires_in

		console.log('Получен токен через auth_code')
		return accessToken
	} catch (authErr) {
		console.error(
			'Ошибка получения токена:',
			authErr.response?.data || authErr.message
		)
		throw new Error('Не удалось получить access_token')
	}
}
