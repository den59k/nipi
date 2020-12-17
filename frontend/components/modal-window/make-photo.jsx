import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { modal } from './index'

import { calcPos, getCanvasBlob, redraw, video2canvas, getStyleButton, findSticker, addPointerEvent, calcZoom, calcAngle } from './canvas-tools'
import styles from './modal.module.sass'

const stickers = [];
for(let i = 1; i <= 10; i++)
	stickers.push('/images/stickers/'+i+'.svg')

function MakePhotoModal ({onSubmit}){

	const videoRef = useRef()
	const canvasRef = useRef()
	const imageDataRef = useRef()    //Это просто как свойство

	const [ mode, setMode ] = useState('')
	const [ stream, setStream ] = useState(null)
	const [ flash, setFlash ] = useState(false)
	const [ stickerState, setStickerState ] = useState([])
	const [ targetSticker, setTargetSticker ] = useState(-1)

	//Здесь мы запрашиваем доступ к камере и выводим изображение на видео
	useEffect(() => {
		setTimeout(() => setMode(mode => mode===''?'permission': mode), 500)
		navigator.mediaDevices.getUserMedia({ audio: false, video: { width: 1280, height: 720 } })
		.then(stream => {
			videoRef.current.srcObject = stream
			videoRef.current.play()
			setStream(stream)
			setMode('accepted')

			modal.onClose = () => stream.getTracks().forEach(track => track.stop())
			
		}).catch(err => setMode('not-accepted'))
	}, [])

	useEffect(() => {
		if(imageDataRef.current === null) return
		redraw(canvasRef.current, stickerState, imageDataRef.current)
	}, [stickerState])

	//Фотографируем
	const onPhoto = () => {
		
		imageDataRef.current = video2canvas(videoRef.current, canvasRef.current)

		setFlash(true);
		setMode("stickers")
		setTimeout(() => setFlash(false), 150);
	}

	//Размещаем новый стикер
	const placeSticker = (e) => {
		const targetSticker = e.currentTarget.children[0];
		const sticker = {
			width: 0.2,
			height: targetSticker.clientHeight/targetSticker.clientWidth*0.2,
			zoom: 1,
			x: 0.5,
			y: 0.5,
			angle: 0,
			target: targetSticker
		}
		
		setTargetSticker(stickerState.length)
		setStickerState([...stickerState, sticker])
	}

	//Если мы нажали на канвас - ищем подходящий стикер
	const onPointerCanvasDown = (e) => {
		const pos = calcPos(e, canvasRef.current)
		e.preventDefault()

		const stickerIndex = findSticker(stickerState, pos)
		setTargetSticker(stickerIndex)
		if(stickerIndex < 0) return
		
		const startStickerPos = stickerState[stickerIndex]
		addPointerEvent(e => {
			e.preventDefault()
			e.stopPropagation()
			const newPos = calcPos(e, canvasRef.current)
			setStickerState(stickerState.map((item, index) => (index !== stickerIndex)? item: {
				...item,
				x: startStickerPos.x + newPos.x - pos.x,
				y: startStickerPos.y + newPos.y - pos.y
			}))
		}, !!e.touches)
	}

	const rotateSticker = (e) => {
		e.preventDefault()
		const pos = calcPos(e, canvasRef.current)
		const startStickerPos = stickerState[targetSticker]
		addPointerEvent((e) => {
			e.preventDefault()
			e.stopPropagation()
			const newPos = calcPos(e, canvasRef.current)
			const angle = calcAngle(startStickerPos, pos, newPos)

			setStickerState(stickerState.map((item, index) => (index !== targetSticker)? item: {
				...item,
				angle: startStickerPos.angle + angle
			}))
		}, !!e.touches)
	}

	const scaleSticker = (e) => {
		e.preventDefault()
		
		const pos = calcPos(e, canvasRef.current)
		const startStickerPos = stickerState[targetSticker]
		addPointerEvent((e) => {
			e.preventDefault()
			e.stopPropagation()
			const newPos = calcPos(e, canvasRef.current)
			const zoom = calcZoom(startStickerPos, pos, newPos)

			setStickerState(stickerState.map((item, index) => (index !== targetSticker)? item: {
				...item,
				zoom
			}))
		}, !!e.touches)
	}

	const deleteSticker = () => {
		setStickerState(stickerState.filter((_item, index) => index !== targetSticker))
		setTargetSticker(-1)
	}

	const _onSubmit = async () => {
		const buffer = await getCanvasBlob(canvasRef.current);
		if(!buffer || buffer.length === 0)
			return;

		onSubmit(buffer)
	}

	return (
		<div className={cn(styles.modal, styles.makePhoto, mode==='stickers' && styles.up)}>
			{mode === 'permission' && <div className={styles.label}>Дайте разрешение на использование камеры</div>}
			<video muted={true} playsInline={true} controls={false} ref={videoRef} style={mode === 'accepted'?{}: {display: 'none'}}/>

			<canvas ref={canvasRef} style={mode === 'stickers'?{}: {display: 'none'}} onMouseDown={onPointerCanvasDown} onTouchStart={onPointerCanvasDown}/>

			{targetSticker >= 0 && targetSticker < stickerState.length && (
				<>
					<button onClick={deleteSticker} className={cn(styles.actionButton, styles.red)} style={getStyleButton(stickerState[targetSticker], -1, -1)}>
						<img src="/images/icons/delete.svg" alt="Удалить стикер" title="Удалить стикер"/>
					</button>
					<button onTouchStart={scaleSticker} onMouseDown={scaleSticker} className={styles.actionButton} style={getStyleButton(stickerState[targetSticker], 1, -1)}>
						<img src="/images/icons/scale.svg" alt="Увеличить стикер" title="Увеличить стикер"/>
					</button>
					<button onTouchStart={rotateSticker} onMouseDown={rotateSticker} className={styles.actionButton} style={getStyleButton(stickerState[targetSticker], 1, 1)}>
						<img src="/images/icons/rotate.svg" alt="Вращать стикер" title="Вращать стикер"/>
					</button>
				</>
			)}

			<div className={cn(styles.flash, flash && styles.active)}></div>
			<div className={styles.panel}>
				{mode === 'accepted' && <button className="button" onClick={onPhoto}>Сфотографировать</button>}
				{mode === 'stickers' && (
					<>
					<div className={styles.stickers}>
						{stickers.map((item, index) => (
							<button key={index} onClick={placeSticker}>
								<img src={item} alt={'Стикер'+index}/>
							</button>
						))}
					</div>
					<button className="button" onClick={_onSubmit}>Сохранить</button>
					</>
				)}
			</div>
		</div>
	)
}


export function openMakePhotoModal (onSubmit){
	modal.open(<MakePhotoModal onSubmit={onSubmit}/>)
}
