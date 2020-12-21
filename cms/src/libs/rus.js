export function StringMonth(month){
	switch (month){
		case 0: return 'января'
		case 1: return 'февраля'
		case 2: return 'марта'
		case 3: return 'апреля'
		case 4: return 'мая'
		case 5: return 'июня'
		case 6: return 'июля'
		case 7: return 'августа'
		case 8: return 'сентября'
		case 9: return 'октября'
		case 10: return 'ноября'
		case 11: return 'декабря'
		default: return month < 10?('0'+month):month
	}
}


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

function _ (num){
	if(num < 10) return "0"+num
	return num
}

export function getTime(time){
	const date = new Date(time)
	return date.getHours() + ":"+_(date.getMinutes())
}