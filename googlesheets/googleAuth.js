import { google } from 'googleapis'
import { CONFIG } from '../config.js'

const auth = new google.auth.GoogleAuth({
	keyFile: CONFIG.googleCredentialsPath,
	scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

export async function getGoogleSheetsClient() {
	const client = await auth.getClient()
	return google.sheets({ version: 'v4', auth: client })
}
