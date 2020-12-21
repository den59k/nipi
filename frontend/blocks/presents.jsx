import styles from './styles/common.module.sass'

import Video from 'components/video'
import Stars from 'components/stars'
import { getTime } from 'libs/rus'
import { useActive } from 'libs/active'

import { Parallax } from 'components/parallax'

export default function PresentsBlock ({timing}){

	const active = useActive(timing.presents)

	return (
		<div className="h flex"  id="presents">
			<Parallax src="/images/background-1.jpg" k={-0.6} className="cover"/>
			<h2>Подарки от Деда Мороза</h2>
			<Stars/>
			<div className="content flex-center">
				<Video className={styles.bigVideo} id={'jQ_mQ9I0PjQ'} time={timing.presents}>
					{!active && <div className={styles.videoLabel}>Награждение начнется в {getTime(timing.presents)}</div>}
				</Video>
			</div>
		</div>
	)
}