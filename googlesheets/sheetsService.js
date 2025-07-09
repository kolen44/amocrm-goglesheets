import { google } from 'googleapis'
import { CONFIG } from '../config.js'

const auth = new google.auth.GoogleAuth({
	keyFile: CONFIG.googleCredentialsPath,
	scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

export async function appendRowToSheet(rowData) {
	const client = await auth.getClient()
	const sheets = google.sheets({ version: 'v4', auth: client })

	const spreadsheetId = CONFIG.googleSheetId
	const range = CONFIG.googleSheetName

	const readResponse = await sheets.spreadsheets.values.get({
		spreadsheetId,
		range,
	})
	const existingRows = readResponse.data.values || []

	const leadIdToCheck = String(rowData[0])
	const leadExists = existingRows.some(row => row[0] === leadIdToCheck)

	if (leadExists) {
		console.log(
			`Сделка ${leadIdToCheck} уже существует в таблице — не записываем повторно`
		)
		return
	}

	await sheets.spreadsheets.values.append({
		spreadsheetId,
		range,
		valueInputOption: 'USER_ENTERED',
		requestBody: {
			values: [rowData],
		},
	})

	console.log('Данные добавлены в таблицу')
}
