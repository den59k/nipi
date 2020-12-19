import React, { useState } from 'react'
import cn from 'classnames'
import { REST } from 'libs/fetch'
import { mutate } from 'swr'

import { modal, ModalBase, closeModal } from './index'


export function ModalPhoto({item}){
	
	const [ state, setState ] = useState(item)

	const accept = async () => {
		const resp = await REST('/api/photos/'+item._id, { accepted: true, rejected: false }, 'PUT')
		setState({...item, accepted: true, rejected: false })
		if(!resp.error) mutate('/api/photos')
	}

	const reject = async () => {
		const resp = await REST('/api/photos/'+item._id, { accepted: false, rejected: true }, 'PUT')
		setState({...item, accepted: false, rejected: true })
		if(!resp.error) mutate('/api/photos')
	}

	const onDelete = async () => {
		const resp = await REST('/api/photos/'+item._id, {}, 'DELETE') 
		if(!resp.error) mutate('/api/photos')
		closeModal()
	}

	return (
		<ModalBase title="Фото-поздравление" className="media">
			<div className="content">
				<img src={state.src} alt="Изображение"/>
			</div>
			<div className="buttons" style={{justifyContent: 'center'}}>
				
				{state.accepted?(
					<div className="label green m">Одобрено</div>
				):(
					<button className="button-filled m" onClick={accept}>Одобрить</button>
				)}
				{state.rejected?(
					<div className="label red m">Запрещено</div>
				):(
					<button className="button-filled red m" onClick={reject}>Запретить</button>
				)}
			</div>
			<div className="buttons" style={{justifyContent: 'center'}}>
			<button className="button red m" onClick={onDelete}>Удалить фото</button>
			</div>
		</ModalBase>
	)
}

export function openModalPhoto(item){
	modal.open(<ModalPhoto item={item}/>)
}