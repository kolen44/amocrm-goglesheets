import dotenv from 'dotenv'
import express from 'express'
import {
	fetchContactData,
	fetchLeadData,
	fetchUserData,
} from './amocrm/amoClient.js'
import { getAccessToken } from './amocrm/tokenManager.js'
import { appendRowToSheet } from './googlesheets/sheetsService.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/', async (req, res) => {
	try {
		const deal = req.body?.leads?.status?.[0] || req.body?.leads?.add?.[0]
		if (!deal) return res.status(400).send('Нет данных о сделке')

		const leadId = deal.id
		const createdAt = new Date(deal.created_at * 1000).toLocaleString()
		const responsibleUserId = deal.responsible_user_id
		const subdomain = req.body.account.subdomain

		const token = await getAccessToken()
		const leadData = await fetchLeadData(leadId, subdomain, token)
		const contactId = leadData?._embedded?.contacts?.[0]?.id
		if (!contactId) throw new Error('Контакт не найден')

		const contactData = await fetchContactData(contactId, subdomain, token)
		const contactName = contactData.name
		const phoneField = contactData.custom_fields_values?.find(
			f => f.field_code === 'PHONE'
		)
		let rawPhone = phoneField?.values?.[0]?.value
		const phone = rawPhone ? `${rawPhone.replace(/^\+/, '')}` : 'Не указано'

		const userData = await fetchUserData(responsibleUserId, subdomain, token)
		const responsibleName = userData.name

		console.log('Номер сделки:', leadId)
		console.log('Дата создания:', createdAt)
		console.log('Имя контакта:', contactName)
		console.log('Телефон контакта:', phone)
		console.log('Ответственный:', responsibleName)
		console.log('ID ответственного:', responsibleUserId)

		await appendRowToSheet([
			leadId,
			createdAt,
			phone,
			contactName,

			responsibleName,
			responsibleUserId,
		])

		res.status(200).send('OK')
	} catch (error) {
		console.error(
			'Ошибка при обработке вебхука (не обязательная ошибка):',
			error.message
		)
		res.status(500).send('Ошибка сервера')
	}
})

app.post('/googlehook', async (req, res) => {
	const budget = Number(req.body.values)
	const dealId = req.body.firstFieldValue

	if (!dealId || req.body.column !== 7 || isNaN(budget))
		return res.status(400).send('Недостаточно или некорректные данные')

	try {
		const token = await getAccessToken()
		const response = await fetch(
			`${process.env.AMO_BASE_URL}/api/v4/leads/${dealId}`,
			{
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ price: budget }),
			}
		)

		const result = await response.json()
		if (!response.ok) throw new Error(JSON.stringify(result))

		console.log('Сделка обновлена:', result)
		res.send('OK')
	} catch (err) {
		console.error('Ошибка при обновлении сделки:', err.message)
		res.status(500).send('Ошибка сервера')
	}
})

app.listen(PORT, () => {
	console.log(`Webhook server running at http://localhost:${PORT}`)
})
