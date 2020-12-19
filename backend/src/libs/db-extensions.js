
function toMultiLanguage (_data, schema, properties={}, lang=null){
	if(!lang && _data.lang) lang = _data.lang;

	const data = {}
	for(let key in _data){
		if(key === 'lang' || key === '_id' || !(key in properties)) continue;
		if(schema.includes(key))
			data[key] = { [lang]: _data[key] }
		else
			data[key] = _data[key]
	}

	return data
}

function toDotNotation (_data, startString=""){
	const data = {}
	const toDot = (obj, str='') => {
		for(let key in obj)
			if(typeof obj[key] === 'object')
				toDot(obj[key], str+key+'.')
			else
				data[str+key] = obj[key]
	}
	toDot(_data, startString)
	return data
}

function filterBody (body, schema){
	const data = {}
	for(let key in body)
		if(key in schema)
			data[key] = body[key]
	return data
}

module.exports = { toMultiLanguage, toDotNotation, filterBody }