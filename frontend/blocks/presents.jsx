import styles from './styles/common.module.sass'

import Video from 'components/video'

export default function PresentsBlock (){

	return (
		<div className="h flex" style={{backgroundImage: `url(/images/background-1.jpg)`}}>
			<h2>Подарки от Деда Мороза</h2>
			<div className="content flex-center">
				<Video className={styles.bigVideo}/>
			</div>
		</div>
	)
}