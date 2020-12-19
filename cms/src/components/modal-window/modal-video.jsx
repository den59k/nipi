import React, { useState } from 'react'
import cn from 'classnames'
import { REST } from 'libs/fetch'
import { mutate } from 'swr'

import { modal, ModalBase, closeModal } from './index'

export function ModalVideo({item}){

	const [ state, setState ] = useState(item)

	const accept = async () => {
	
		const resp = await REST('/api/videos/'+item._id, { accepted: true, rejected: false }, 'PUT')
		setState({...item, accepted: true, rejected: false })
		if(!resp.error) mutate('/api/videos')
	}

	const reject = async () => {
	
		const resp = await REST('/api/videos/'+item._id, { accepted: false, rejected: true }, 'PUT')
		setState({...item, accepted: false, rejected: true })
		if(!resp.error) mutate('/api/videos')
	}

	const onDelete = async () => {
		const resp = await REST('/api/videos/'+item._id, {}, 'DELETE') 
		if(!resp.error) mutate('/api/videos')
		closeModal()
	}

	const transcode = async () => {
		const resp = await REST('/api/videos/'+item._id+'/transcode', {})
		if(!resp.error) mutate('/api/videos')
		closeModal()
	}

	return (
		<ModalBase title="Видео-поздравление">
			<div className="content">
				<video src={state.transcoded || state.src} alt="Видеоролик" autoPlay={true} controls={true}/>
			</div>
			<div className="buttons" style={{justifyContent: 'center'}}>
				
				{state.accepted?(
					<div className="label green m" >Одобрено</div>
				):(
					<button className="button-filled m" onClick={accept}>Одобрить</button>
				)}
				{state.rejected?(
					<div className="label red m" >Запрещено</div>
				):(
					<button className="button-filled red m" onClick={reject}>Запретить</button>
				)}
			</div>
			<div className="buttons" style={{justifyContent: 'center'}}>
				<button className="button-filled" onClick={transcode}>Перекодировать видео</button>
			</div>
			<div className="buttons" style={{justifyContent: 'center'}}>
				<button className="button red" onClick={onDelete}>Удалить видео</button>
			</div>
		</ModalBase>
	)
}

export function openModalVideo(item){
	modal.open(<ModalVideo item={item}/>)
}