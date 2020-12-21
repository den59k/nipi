import { useState } from 'react'
import cn from 'classnames'
import { openGameModal } from 'components/modal-window'

import styles from './styles/games.module.sass'

import { Parallax } from 'components/parallax'
import Catcher from 'components/games/catcher'
import Barley from 'components/games/barley'
import Elka from 'components/games/elka'


const text1 = `Вы прошли игру и получаете новогоднюю звезду!
🌟
Вам открыт доступ к Ёлке пожеланий.
Выберите новогодний шар, нажмите на него и узнайте Ваше личное Новогоднее пожелание!`

const text2 = `Если Вы хотите открыть ещё один Новогодний шар с пожеланием, пройдите вторую игру`

export default function GamesBlock(){
	
	const [ activeGame, setActiveGame ] = useState(0)
	const [ stars, setStars ] = useState(0)

	const onWin = () => {
		openGameModal('Поздравляем!', text1, () => {
			setActiveGame(2)
			setStars(stars => stars+1)
		})
	}

	//Когда мы открываем шар на елке - у нас убирается одна звезда
	const onOpen = () => {
		setTimeout(() => openGameModal('', text2), 5000)
		setStars(stars => stars-1)
	}

	
	const games = [
		{ component: <Catcher className={styles.game} onWin={onWin} active={activeGame === 0}/> },
		{ component: <Barley className={styles.game} src="/lukoil.jpg" onWin={onWin} active={activeGame === 1}/> },
		{ component: <Elka className={styles.game} onOpen={onOpen} stars={stars} active={activeGame === 2}/>}
	]

	const slide = (inc) => {
		const newGame = activeGame+inc
		if(newGame < games.length && newGame >= 0) setActiveGame(newGame)
	}
	

	return (
		<div className={cn("h flex", styles.background)} id="games">
			<Parallax src="/images/background-games.jpg" k={-0.5} className="cover"/>
			<h2>Новогодняя игротека</h2>
			<div className={styles.container}>
				<button className={cn(styles.leftButton, activeGame === 0 && styles.hide)} onClick={() => slide(-1)}>
					<img src="/images/games/right-button.png" alt="Листать влево"/>
				</button>
				{games.map((item, index) => (
					<div className={cn(
						styles.gameContainer, 
						activeGame < index && styles.hideLeft, 
						activeGame > index && styles.hideRight
					)} key={index} >
						{item.component}
					</div>
				))}
				<button className={cn(styles.rightButton, activeGame === games.length-1 && styles.hide)} onClick={() => slide(1)}>
					<img src="/images/games/right-button.png" alt="Листать вправо"/>
				</button>
			</div>
		</div>
	)
}