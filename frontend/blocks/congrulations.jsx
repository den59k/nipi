import cn from 'classnames'
import styles from './styles/congrulations.module.sass'

import Video from 'components/video'
import { Parallax } from 'components/parallax'

const videos = [
	{ 
		title: "Поздравление\nЗаместителя Генерального директора\nДиректора филиала «ПермНИПИнефть»",
		name: "Надежды Алексеевны Лядовой",
		id: "uEaouwm3ebA"
	},
	{ 
		title: "Поздравление\nПредседателя Первичной\nПрофсоюзной Организации",
		name: "Ирины Викторовны Абалмасовой",
		id: "uEaouwm3ebA"
	}
]

export default function Congrulations(){

	return (
		<div className="h flex" id="congrulations">
			<Parallax src="/images/background-0.jpg" k={-0.4} className="cover"/>
			<h2>Новогодние поздравления</h2>
			<div className={cn("content container", styles.container)}>
				<div>
					{videos.map((item, index) => (
						<div key={index} className={styles.item}>
							<div className={styles.title}>
								<div>{item.title}</div>
								<div className={styles.name}>{item.name}</div>
							</div>
							<Video id={item.id} className="big"/>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}