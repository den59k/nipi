import cn from 'classnames'

import styles from './video.module.sass'
import { openYoutubeModal } from 'components/modal-window'

export default function Video ({className, preview, id, time, children, type}){
	
	return (
		<button 
			onClick={() => openYoutubeModal(id, time, type)} 
			className={cn(styles.video, className)} 
			style={preview?{backgroundImage: `url(${preview})`}: {}}
		>
			<img src="/images/play.svg" alt="play"/>
			{children}
		</button>
	)
}