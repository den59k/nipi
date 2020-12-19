import { useEffect, useState } from 'react'
import cn from 'classnames'

import styles from './elka.module.sass'

const wishes = [
	'Богатства',
	'Выгодных контрактов',
	'Карьерного роста',
	'Успеха',
	'Славы',
	'Смелых начинаний',
	'Достижения целей',
	'Продуктивности',
	'Постоянного развития',
	'Гениальных идей',
	'Признания заслуг',
	'Умения убеждать',
	'Легких путей',
	'Внутренней свободы',
	'Всегда идти вперед',
	'Всё успевать',
	'Далеко пойти',
	'Любви',
	'Надежды',
	'Счастья',
	'Душевного тепла',
	'Терпения',
	'Отличного самочувствия',
	'Энергичности',
	'Богатырской силы',
	'Ясного ума',
	'Романтики',
	'Незабываемых встреч',
	'Уважения в коллективе',
	'Душевного общения'
]

export default function Elka ({className, stars, onOpen, active}) {

	const [ wish, setWish ] = useState(null)

	const open = () => {
		if(stars <= 0) return
		setWish(wishes[Math.floor(Math.random()*wishes.length)])
		onOpen()
	}

	useEffect(() => {
		if(!active)
			setWish(null)
	}, [active])


	const getLabel = () => {
		if(stars > 0)
			return 'Нажмите на шар на елке, чтобы узнать свое Новогоднее пожелание'

		if(wish)
			return 'Чтобы открыть еще одно пожелание пройдите еще одну игру'
		else
			return 'Чтобы прочесть Новогоднее пожелание, пройдите игру «Пятнашки» или «Ловец подарков».'

	}

	return (
		<div className={cn(className, styles.container)}>
			<h3>Елка пожеланий</h3>
			<div className={styles.flex}>
				
				<div className={cn(styles.shar, !wish && styles.hide)}>
					<div className={styles.text}>{wish}</div>
				</div>
		
				<button className={styles.elka} onClick={open}>
					<img src="/images/games/el.png" alt="Елка" />
				</button>
				<div className={styles.label}>
					<img src="/images/games/new-year.png" alt="С Новым Годом!"/>
					<div>{getLabel()}</div>
				</div>
			</div>
		</div>
	)
}