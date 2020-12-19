const loadFile = (file) => new Promise((res, rej) => {

	const reader = new FileReader();				//Мы еще должны превратить наше изображение в массив и сразу отправить на сервер
	reader.onload = async () => {
		const array = reader.result;
		res(array)
	}

	reader.readAsArrayBuffer(file)

})


export default loadFile