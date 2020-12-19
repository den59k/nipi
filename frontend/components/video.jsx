import cn from 'classnames'

import styles from './video.module.sass'
import { openYoutubeModal } from 'components/modal-window'

export default function Video ({className, preview, id}){
	
	return (
		<button 
			onClick={() => openYoutubeModal(id)} 
			className={cn(styles.video, className)} 
			style={preview?{backgroundImage: `url(${preview})`}: {}}
		>
			<img src="/images/play.svg" alt="play"/>
		</button>
	)
}