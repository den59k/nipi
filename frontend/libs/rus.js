export function numeral(count, one, two, five){
	if(!count) count = 0;
	//десять-девятнадцать
	if(count%100/10>>0 === 1)
		return five;
	//ноль, пять-девять
	if(count%10 >= 5 || count%10===0)
		return five;
	//один
	if(count%10 === 1)
		return one;

	//две-четыре
	return two;
}

export function num(count, one, two, five){
	return count + " " + numeral(count, one, two, five)
}

function _ (num){
	if(num < 10) return "0"+num
	return num
}

export function getChatDate(date){
	const dt = new Date(date)

	return `${_(dt.getDate())}.${_(dt.getMonth())}.${dt.getFullYear()}. в ${(dt.getHours())}:${_(dt.getMinutes())}`
}

export function _lang(item, lang){
	if(typeof(item) === 'object')
		return item[lang] || item.ru
	
	return item
}

export function getLang(item, lang){
	const newItem = {}
	for(const key in item)
		if(typeof item[key] === 'object' && (item[key][lang] || item[key]['ru']))
			newItem[key] = item[key][lang] || item[key]['ru']
		else
			newItem[key] = item[key]
			
	return newItem
}
