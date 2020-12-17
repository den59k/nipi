import cn from 'classnames'
import { modal } from './index'

import styles from './modal.module.sass'

function VideoModal ({src}){

	return (
		<div className={cn(styles.modal, styles.video)}>
			<video src={src} controls={true} autoPlay={true}/>
		</div>
	)
}

export function openVideoModal (src){
	modal.open(<VideoModal src={src}/>)
}