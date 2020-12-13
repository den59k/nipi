import cn from 'classnames'

import styles from './video.module.sass'

export default function Video ({className, preview}){

	return (
		<button className={cn(styles.video, className)} style={preview?{backgroundImage: `url(${preview})`}: {}}>
			<img src="/images/play.svg" alt="play"/>
		</button>
	)
}