import { useState } from 'react'
import cn from 'classnames'
import { num } from 'libs/rus'
import { mutate } from 'swr'
import { REST } from 'libs/fetch'

import styles from './styles/participant.module.sass'

import Video from 'components/video'
import videoStyles from 'components/video.module.sass'
import { openCongrulationModal } from 'components/modal-window'

import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

const maxLength = 200
function getPreview(str){
	let pos = 0
	
	for(let i = 0; i < maxLength; i++)
		if(str[i] === '.' || str[i] === '!' || str[i] === '?')
			pos = i

	return str.slice(0, pos)
}

export default function ParticipantBlock ({ headerClassName, title, wishes, youtube_id, preview, index, likes, liked}){

	const [ currentWish, setCurrentWish ] = useState(0)

	const wish = wishes && wishes[currentWish]

	const slide = (inc) => {
		let  newCurrentWish = currentWish+inc
		if(newCurrentWish < 0) newCurrentWish = wishes.length - 1
		if(newCurrentWish >= wishes.length) newCurrentWish = 0

		setCurrentWish(newCurrentWish)
	}

	const onLike = async () => {
	
		const resp = await REST ('/api/likes', {index}, liked?'DELETE': 'POST')
		if(!resp.error) mutate('/api')
	}

	return (
		<div className={cn("h flex")} id={"part-"+(index+1)}>
			<h2 className={headerClassName}>Направление «{title}»</h2>
			<div className={cn("content container", styles.container)}>
				<img className={styles.hit} src="/images/hit-parad.png" alt="Хит парад"/>
				<div>
					<div className={styles.textBlock}>
						<div className={styles.title}>Поздравления от руководителей направления «{title}»</div>
						{wish && (
							<div className={styles.wish}>
								<div className={styles.text}>«{getPreview(wish.wish)}»</div>
								<button className={styles.readMore} onClick={() => openCongrulationModal(wish)}>Читать далее...</button>
								<div className={styles.leader}>{wish.name}</div>
								<div className={styles.role}>{wish.role}</div>
								{wishes.length > 1 && (<div className={styles.buttons}>
									<button onClick={() => slide(-1)} className={styles.left}></button>
									<button onClick={() => slide(1)}></button>
								</div>)}
							</div>
						)}
					</div>
					<div>
						<Video id={youtube_id} className={styles.video} preview={preview}/>
						<div className={styles.likePanel}>
							<button className={cn(styles.like, !liked && styles.likeOff)} onClick={onLike}>
								{liked?<img src="/images/like.svg" alt="Лайк"/>: <img src="/images/like-off.svg" alt="Лайк"/>}
							</button>
							<div className={styles.red}>{num(likes, "отметка", "отметки", "отметок")} «Нравится»</div>
							<div>Голосование до 14.00</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}