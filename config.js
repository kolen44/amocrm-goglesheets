import dotenv from 'dotenv'
dotenv.config()

export const CONFIG = {
	refreshToken: process.env.REFRESH_TOKEN,
	accessToken: process.env.ACCESS_TOKEN,
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	redirectUri: process.env.REDIRECT_URI,
	authCode: process.env.AUTH_CODE,
	webhookUrl: process.env.WEBHOOK_URL,
	googleSheetId: process.env.GOOGLE_SHEET_ID,
	googleSheetName: process.env.GOOGLE_SHEET_NAME,
	googleCredentialsPath: process.env.GOOGLE_CREDENTIALS_PATH,
}
