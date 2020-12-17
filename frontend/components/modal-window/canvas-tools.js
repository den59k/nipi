
	//Вспомогательная функция, чтобы высчитать координаты мыши в процентах
export const calcPos = (e, canvas) => {
	if(e.touches) 	e = e.touches[0];

	const rect = canvas.getBoundingClientRect();
	const x = (e.clientX - rect.x)/rect.width;
	const y = (e.clientY - rect.y)/rect.height;

	return {x, y};
}

//Функция для вычисления угла
export function calcAngle (stickerPos, oldPos, newPos){
	const oldVec = { x: oldPos.x - stickerPos.x, y: oldPos.y - stickerPos.y	}
	oldVec.len = Math.sqrt(oldVec.x * oldVec.x + oldVec.y * oldVec.y)

	const newVec = { x: newPos.x - stickerPos.x, y: newPos.y - stickerPos.y	}
	newVec.len = Math.sqrt(newVec.x * newVec.x + newVec.y * newVec.y)

	const cos = (oldVec.x*newVec.x + oldVec.y*newVec.y) / (oldVec.len * newVec.len);
	const angle = Math.acos(cos)
	
	if(oldVec.x * newVec.y < oldVec.y * newVec.x)
		return -angle
	
	return angle
}

export function calcZoom (stickerPos, oldPos, newPos){
	const oldVec = { x: oldPos.x - stickerPos.x, y: oldPos.y - stickerPos.y	}
	oldVec.len = Math.sqrt(oldVec.x * oldVec.x + oldVec.y * oldVec.y)

	const newVec = { x: newPos.x - stickerPos.x, y: newPos.y - stickerPos.y	}
	newVec.len = Math.sqrt(newVec.x * newVec.x + newVec.y * newVec.y)
	
	const zoom = stickerPos.zoom * newVec.len / oldVec.len

	if(zoom < 0.4) return 0.4

	if(zoom > 4) return 4

	return zoom
}

//Функция добавление событий перемещения
export function addPointerEvent (event, touch=false) {
	if(touch){
		document.addEventListener('touchmove', event, { passive: false })
		document.addEventListener('touchend', () => document.removeEventListener('touchmove', event), { once: true })
	}else{
		document.addEventListener('mousemove', event)
		document.addEventListener('mouseup', () => document.removeEventListener('mousemove', event), { once: true })
	}
}

//Функция поиска стикера в стейте
export function findSticker (stickerState, pos) {
	//Мы ищем стикер с конца - чтоб попались те стикеры, которые сверху
	for(let i = stickerState.length - 1; i >= 0; i--){
		const sticker = stickerState[i];
		if(Math.abs(sticker.x - pos.x) < sticker.width/2*sticker.zoom && Math.abs(sticker.y - pos.y) < sticker.height/2*sticker.zoom)
			return i
	}
	return -1
}

//Просто удобная функция, чтобы расзместить кнопки трансформации
export function getStyleButton (sticker, x, y) {
	return {
		left: (sticker.x + sticker.width/2 * x * sticker.zoom)*100+'%', 
		top: (sticker.y + sticker.height/2 * y * sticker.zoom)*100+'%'
	}
}

//Здесь мы помещаем видео на канвас и возвращаем имейдж-дату, чтобы ее сохранять
export function video2canvas (video, canvas){
	const width = video.videoWidth;
	const height = video.videoHeight;

	const min = Math.min(width, height);

	canvas.width = min;
	canvas.height = min;
	
	const ctx = canvas.getContext('2d');
	//ctx.save();
	//ctx.scale(-1, 1);

	if(width > height)
		ctx.drawImage(video, width/2-min/2, 0, min, min, 0, 0, min, min);
	else
		ctx.drawImage(video, 0, height/2-min/2, min, min, 0, 0, min, min);

	//ctx.restore();

	return ctx.getImageData(0, 0, min, min);
}

//А здесь мы перерисовываем канвас
export function redraw(canvas, stickerState, imageData){
	const ctx = canvas.getContext('2d');
	if(imageData) ctx.putImageData(imageData, 0, 0);

	const width = canvas.width;
	for(let sticker of stickerState){

		ctx.save();

		const top = (- sticker.height/2 * sticker.zoom) * width ;
		const left = (- sticker.width/2 * sticker.zoom) * width ;

		ctx.translate(-sticker.x * width, -sticker.y * width);
		const angle = sticker.angle;
		ctx.rotate(angle);
		ctx.translate(
			sticker.x * width * 2 * Math.cos(angle) + sticker.y * width * 2 * Math.sin(angle), 
			-sticker.x * width * 2 * Math.sin(angle) + sticker.y * width * 2 * Math.cos(angle)
		);

		ctx.drawImage(sticker.target, left, top, sticker.width*sticker.zoom*width, sticker.height*sticker.zoom*width);

		ctx.restore();
	}
}

export const getCanvasBlob = (canvas) => new Promise((res, rej) => {
	const reader = new FileReader;
	reader.onload = (e) => res(e.target.result);

	canvas.toBlob(blob => reader.readAsArrayBuffer(blob), 'image/jpeg', 0.7);
})