import { useState, useRef, useEffect } from 'react'
import cn from 'classnames'
import { modal } from './index'

import styles from './modal.module.sass'
import { num } from 'libs/rus'

function RecordModal ({onSubmit}){
	
	const videoRef = useRef()
	const bufferRef = useRef()

	const [ mode, setMode ] = useState('')
	const [ stream, setStream ] = useState(null)
	const [ recorder, setRecorder ] = useState(null)

	const [ timer, setTimer ] = useState(0)
	const [ intervalObject, setIntervalObject ] = useState(null)
	
	useEffect(() => {
		setTimeout(() => setMode(mode => mode===''?'permission': mode), 1000)
		
		navigator.mediaDevices.getUserMedia({ audio: true, video: { width: 1280, height: 720 } })
		.then(stream => {
			videoRef.current.srcObject = stream
			videoRef.current.play()
			videoRef.current.muted = true
			setStream(stream)
			setMode('accepted')

			modal.onClose = () => stream.getTracks().forEach(track => track.stop())

		}).catch(err => setMode('not-accepted'))
	}, [])
	
	const onStartRecord = () => {
		if(!stream) return

		//Мы начинаем запись, и возвращаем коллбэк, который выполнится при окончании
		const recorder = startRecord(stream, (superBuffer) => {
			videoRef.current.srcObject = null
			bufferRef.current = superBuffer
			videoRef.current.src = window.URL.createObjectURL(superBuffer)
			videoRef.current.play()
			videoRef.current.controls = true
			videoRef.current.muted = false
			setMode('recorded')
		})
		setMode('record')
		setRecorder(recorder)
		setTimer(0)
		const interval = setInterval(() => setTimer(timer => timer+1), 1000)
		setIntervalObject(interval)
	}

	const onStopRecord = () => {
		recorder.stop()
		clearInterval(intervalObject)
	}

	const onAgain = () => {
		videoRef.current.srcObject = stream
		videoRef.current.play()
		videoRef.current.controls = false
		videoRef.current.muted = true
		setMode('accepted')
	}

	const onSave = async () => {
		onSubmit(bufferRef.current)
	}

	return (
		<div className={cn(styles.modal, styles.video, (mode === 'permission' || mode === 'not-accepted') && styles.permission)}>
			{mode === 'permission' && (<div>Разрешите доступ к камере и к микрофону</div>)}
			{mode === 'not-accepted' && (<div>В вашем браузере произошла ошибка.<br/>Воспользуйтесь другим браузером</div>)}
			<video playsInline={true} ref={videoRef}></video>
			{mode ==='record' && <div className={styles.recordAlert}>Идет запись! - {num(timer, "секунда", "секунды", "секунд")}</div>}
			<div className={styles.buttons}>
				{mode === 'accepted' && <button className={cn("button")} onClick={onStartRecord}>Начать запись</button>}
				{mode === 'record' && <button className={cn("button")} onClick={onStopRecord}>Закончить запись</button>}
				{mode === 'recorded' && <button className={cn("button")} onClick={onAgain}>Переснять</button> }
				{mode === 'recorded' && <button className={cn("button")} onClick={onSave}>Сохранить</button> }
			</div>
		</div>
	)

}


function startRecord(stream, onEnd){
	const  recordedBlobs = [];
	let options = {mimeType: 'video/mp4'};
	if (!MediaRecorder.isTypeSupported(options.mimeType)) {
		console.error(`${options.mimeType} is not supported`);
		options = {mimeType: 'video/mpeg'};
		if (!MediaRecorder.isTypeSupported(options.mimeType)) {
			console.error(`${options.mimeType} is not supported`);
			options = {mimeType: 'video/webm'};
			if (!MediaRecorder.isTypeSupported(options.mimeType)) {
				console.error(`${options.mimeType} is not supported`);
				options = {mimeType: ''};
			}
		}
	}

	let mediaRecorder
	try {
		mediaRecorder = new MediaRecorder(stream, options);
	} catch (e) {
		console.error('Exception while creating MediaRecorder:', e);
		return;
	}
	const type = options.mimeType;
	console.log('Создан MediaRecorder', mediaRecorder, 'с настройками', options);

	mediaRecorder.ondataavailable = (e) => {
		if(e.data && e.data.size > 0){
			recordedBlobs.push(e.data);

			//Чекаем, если это был последний чанк
			if(mediaRecorder.state === 'inactive' && onEnd){
				
				const superBuffer = new Blob(recordedBlobs, {type});
				onEnd(superBuffer)
			}
		}
	}

	mediaRecorder.start();

	return mediaRecorder;
}

export function openRecordModal (onSubmit){
	modal.open(<RecordModal onSubmit={onSubmit}/>)
}