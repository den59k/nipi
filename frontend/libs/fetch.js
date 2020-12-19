export const GET = async(url) => {
	console.log("Был запрос - "+url);
	const response = await fetch(url, {
		method: 'GET'
	});

	const json = await response.json();

	return json;
}

export const REST = async (url, body, method) => {

	const response = await fetch(url, {
		method: method || 'POST',
		body: JSON.stringify(body),
		headers: {
		 'Content-Type': 'application/json;charset=utf-8'
		}
	});

	const json = await response.json();

	return json;

}
