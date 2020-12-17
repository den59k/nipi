import cn from 'classnames'
import { num } from 'libs/rus'

import styles from './styles/participant.module.sass'

import Video from 'components/video'
import videoStyles from 'components/video.module.sass'
import { openCongrulationModal } from 'components/modal-window'

export default function ParticipantBlock ({ headerClassName, likes, name, text, leader, role, id, preview }){

	return (
		<div className={cn("h flex")}>
			<h2 className={headerClassName}>Направление «{name}»</h2>
			<div className={cn("content container", styles.container)}>
				<img className={styles.hit} src="/images/hit-parad.png" alt="Хит парад"/>
				<div>
					<div className={styles.textBlock}>
						<div className={styles.title}>Поздравления от руководителей направления «{name}»</div>
						<div className={styles.text}>«{text}»</div>
						<button className={styles.readMore} onClick={openCongrulationModal}>Читать далее...</button>
						<div className={styles.leader}>{leader}</div>
						<div className={styles.role}>{role}</div>
					</div>
					<div>
						<Video id={id} className={styles.video} preview={preview}/>
						<div className={styles.likePanel}>
							<button className={styles.like}><img src="/images/like.svg" alt="Лайк"/></button>
							<div className={styles.red}>{num(58, "отметка", "отметки", "отметок")} «Нравится»</div>
							<div>Голосование до 14.00</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}