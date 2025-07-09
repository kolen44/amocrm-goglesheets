export async function fetchLeadData(leadId, subdomain, token) {
	const url = `https://${subdomain}.amocrm.ru/api/v4/leads/${leadId}?with=contacts`
	const res = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	})
	if (!res.ok) throw new Error('Ошибка получения сделки')
	return await res.json()
}

export async function fetchContactData(contactId, subdomain, token) {
	const url = `https://${subdomain}.amocrm.ru/api/v4/contacts/${contactId}`
	const res = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	})
	if (!res.ok) throw new Error('Ошибка получения контакта')
	return await res.json()
}

export async function fetchUserData(userId, subdomain, token) {
	const url = `https://${subdomain}.amocrm.ru/api/v4/users/${userId}`
	const res = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	})
	if (!res.ok) throw new Error('Ошибка получения пользователя')
	return await res.json()
}
