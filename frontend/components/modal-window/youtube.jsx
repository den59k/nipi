import cn from 'classnames'
import { modal } from './index'

import styles from './modal.module.sass'

function YoutubeModal ({id}){

	return (
		<div className={cn(styles.modal, styles.youtube)}>
			<iframe 
				width="100%" 
				height="100%" 
				src={`https://www.youtube.com/embed/${id}?autoplay=1&controls=1&rel=0&showinfo=0&modestbranding=1`}
				frameBorder="0" 
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
				allowFullScreen={true}
			></iframe>
		</div>
	)
}

export function openYoutubeModal (id){
	modal.open(<YoutubeModal id={id}/>)
}