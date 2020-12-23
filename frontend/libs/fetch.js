export const GET = async(url) => {
	console.log("Был запрос - "+url);

	const headers = new Headers();
	headers.append('pragma', 'no-cache');
	headers.append('cache-control', 'no-cache');

	const response = await fetch(url, {
		method: 'GET',
		headers
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
