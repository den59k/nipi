import React, { useState } from 'react'
import cn from 'classnames'
import styles from './modal.module.sass'

import { openCongrulationModal } from './congrulation'
import { openYoutubeModal } from './youtube'
import { openRecordModal } from './record-video'
import { openMakePhotoModal } from './make-photo'
import { openVideoModal } from './video'
import { openGameModal } from './game'

export { 
	openYoutubeModal, 
	openRecordModal, 
	openMakePhotoModal, 
	openVideoModal, 
	openCongrulationModal, 
	openGameModal 
}

export const modal = {
	open: () => console.log("null action openModal"),
	close: () => console.log("null action closeModal"),
	scrollTo: () => console.log("null action scroll"),
	alert: () => console.log("null action alert"),
	opened: false
}

export function closeModal(){
	modal.close()
}

export function ModalWrapper (props){
	
	const [ modalWindow, setModalWindow ] = useState(null);
	const [ scroll, setScroll ] = useState(null);

	modal.open = (_modal, _onClose=null) => {
		modal.opened = true;
		setScroll({left: window.pageXOffset, top: window.pageYOffset, offset: window.innerWidth-document.body.clientWidth});
		setModalWindow(_modal);
		window.requestAnimationFrame(() => window.scroll(0, 0));
		modal.onClose = _onClose;
	}

	modal.close = () => {
		setTimeout(() => modal.opened = false, 100)
		setModalWindow(null);
		window.requestAnimationFrame(() => window.scroll(scroll.left, scroll.top));
		if(modal.onClose)
			modal.onClose();
	}

	const onClick = (e) => {					
		const target = e.currentTarget;
		if(target === e.target){
			document.addEventListener("mouseup", (e2) => {		//Ну а вот это неплохой код для модалки
				if(target === e2.target)
					modal.close();
			}, { once: true });
		}		
	}

	return (
		<>
			<div 
				className={cn({[props.className]: true, [styles.fixed]: modalWindow !== null})} 
				style={scroll?{...props.style, top: -scroll.top+'px', left: -scroll.left+'px', right: scroll.offset+'px'}: props.style}
			>
				{props.children}
			</div>
			{modalWindow !== null && (
				<div className={styles.black} onMouseDown={onClick}>
					{modalWindow}
				</div>
			)}
		</>
	)
}
