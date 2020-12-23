import { useState } from 'react'
import cn from 'classnames'
import { getTime, num } from 'libs/rus'
import { mutate } from 'swr'
import { REST } from 'libs/fetch'

import styles from './styles/participant.module.sass'

import Video from 'components/video'
import videoStyles from 'components/video.module.sass'
import { openCongrulationModal } from 'components/modal-window'
import Stars from 'components/stars'

import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { useActive } from 'libs/active'

const maxLength = 200
function getPreview(str){
	let pos = 0
	
	for(let i = 0; i < maxLength; i++)
		if(str[i] === '.' || str[i] === '!' || str[i] === '?')
			pos = i

	return str.slice(0, pos)
}

function getClassName (index){
	if(index % 2 === 0) return styles.snowBackground
	if(index % 4 === 1) return styles.background
	return styles.background4
}

export default function ParticipantBlock ({ wistia, headerClassName, title, wishes, youtube_id, preview, index, likes, liked, timing}){
	
	const activeStart = useActive(timing.startVote)
	const activeFinish = useActive(timing.finishVote)

	const [ currentWish, setCurrentWish ] = useState(0)
	const [ lastWish, setLastWish ] = useState(null)

	const wish = wishes && wishes[currentWish]

	const slide = (inc) => {
		let  newCurrentWish = currentWish+inc
		if(newCurrentWish < 0) newCurrentWish = wishes.length - 1
		if(newCurrentWish >= wishes.length) newCurrentWish = 0

		setLastWish(<Wish key={currentWish} wish={wish} className={inc < 0? styles.hideLeft : styles.hideRight}/>)
		setCurrentWish(newCurrentWish)
	}

	const onLike = async () => {
		
		if(Date.now() < timing.startVote || Date.now() > timing.finishVote) return 
		
		const resp = await REST ('/api/likes', {index}, liked?'DELETE': 'POST')
		
		if(!resp.error) mutate('/api', (data) => {
			const indexes = liked?data.indexes.filter(item => item.index !== index): [...data.indexes, { index }]
			const inc = liked?-1: 1
			
			const likes = data.likes.map(item => item.index === index?{...item, likes: item.likes + inc}: item)
			return Object.assign({}, data, { indexes, likes })
		}, false)
	}

	const getLabel = () => {
		if(!activeStart) return 'Голосование начнется в '+ getTime(timing.startVote)
		if(activeFinish) return 'Голосование закончилось в ' + getTime(timing.finishVote)

		return  'Голосование до '+ getTime(timing.finishVote)
	}


	return (
		<div className={cn("h flex", getClassName(index))} id={"part-"+(index+1)}>
			<h2 className={headerClassName}>Направление «{title}»</h2>
			<Stars index={index}/>
			<div className={cn("content container", styles.container)}>
				<img className={styles.hit} src="/images/hit-parad.png" alt="Хит парад"/>
				<div>
					<div className={styles.textBlock}>
						<div className={styles.title}>Поздравления от руководителей направления «{title}»</div>
							{wishes && (<div className={styles.wish}>
								{wishes.map((item, index) => (
									<Wish key={index} className={cn(
										index < currentWish && styles.hideLeft, 
										index > currentWish && styles.hideRight
									)} wish={wish}/>
								))}
								{wishes.length > 1 && (<div className={styles.buttons}>
									<button onClick={() => slide(-1)} className={cn(currentWish === 0 && styles.hide, styles.left)}></button>
									<button onClick={() => slide(1)} className={cn(currentWish === wishes.length-1 && styles.hide)}></button>
								</div>)}
							</div>)}
					</div>
					<div>
						<Video id={wistia || youtube_id} type={wistia?'wistia': 'youtube'} className={styles.video} preview={preview}/>
						<div className={styles.likePanel}>
							<button className={cn(styles.like, !liked && styles.likeOff)} onClick={onLike}>
								{liked?<img src="/images/like.svg" alt="Лайк"/>: <img src="/images/like-off.svg" alt="Лайк"/>}
							</button>
							<div className={styles.red}>{num(likes, "отметка", "отметки", "отметок")} «Нравится»</div>
							{<div>{getLabel()}</div>}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}


function Wish ({wish, className}){
	return (
		<div className={cn(styles.wishContainer, className)}>
			<div className={cn(styles.text)}>«{getPreview(wish.wish)}»</div>
			<button className={styles.readMore} onClick={() => openCongrulationModal(wish)}>Читать далее...</button>
			<div className={styles.leader}>{wish.name}</div>
			<div className={styles.role}>{wish.role}</div>
		</div>
	)
}