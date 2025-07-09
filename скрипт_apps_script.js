//ДАННЫЙ СКРИПТ НАПИСАН ДЛЯ apps_script и служит в основном для вебхука от гугл таблиц для получения бюджета при изменении из таблицы

function generateData(e) {
	const ss = SpreadsheetApp.getActiveSpreadsheet()
	const sheet = ss.getActiveSheet()
	const sheetName = sheet.getName()
	const spreadsheetName = ss.getName()
	const spreadsheetId = ss.getId()

	const range = sheet.getActiveRange()
	const row = range.getRow()
	const column = range.getColumn()
	const values = range.getValue()
	const firstCellValue = sheet.getRange(row, 1).getValue()

	const user = e.user || 'unknown'
	const date = new Date()

	sendWebhook(
		spreadsheetName,
		sheetName,
		row,
		column,
		values,
		user,
		date,
		spreadsheetId,
		firstCellValue
	)
}

function sendWebhook(
	spreadsheetName,
	sheetName,
	row,
	column,
	values,
	user,
	date,
	spreadsheetId,
	firstCellValue
) {
	const endpoint = 'https://7b99-88-18-17-243.ngrok-free.app/googlehook'

	const payload = {
		spreadsheetName: spreadsheetName,
		sheetName: sheetName,
		row: row,
		column: column,
		values: JSON.stringify(values),
		firstFieldValue: firstCellValue,
		user: user,
		date: date,
		spreadsheetId: spreadsheetId,
	}

	const options = {
		method: 'post',
		contentType: 'application/json',
		payload: JSON.stringify(payload),
	}

	UrlFetchApp.fetch(endpoint, options)
}

function createSpreadsheetOpenTrigger() {
	const ss = SpreadsheetApp.getActive()
	ScriptApp.newTrigger('generateData').forSpreadsheet(ss).onChange().create()
}
