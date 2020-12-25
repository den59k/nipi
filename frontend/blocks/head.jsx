import cn from 'classnames'
import onClick from 'libs/smooth-href'
import { getTime } from 'libs/rus'
import styles from './styles/head.module.sass'

import { Parallax } from 'components/parallax'
import { openYoutubeModal } from 'components/modal-window/youtube'

const stars = [
	{ title: "АУП и ВП", to: "/#part-3", className: styles.star1 },
	{ title: "РАЗРАБОТКА", to: "/#part-6", className: styles.star2 },
	{ title: "ПИР", to: "/#part-5", className: styles.star3 },
	{ title: "БУРЕНИЕ", to: "/#part-2", className: styles.star4 },
	{ title: "ГЕОЛОГИЯ", to: "/#part-1", className: styles.star5 },
	{ title: "ДОБЫЧА", to: "/#part-4", className: styles.star6 }
]

const menuItems = [
	{ title: "Новогодняя фотогалерея", to: "/#photo-gallery" },
	{ title: "Новогодняя игротека", to: "/#games" },
	{ title: "Новогодние поздравления", to: "/#congrulations" },
	{ title: "Подарки\nот деда мороза", to: "/#presents" },
	{ title: "Новогодний\nчат", to: "/#chat" },
]

const video = { id: "3B_0unsSTWo" }

export default function HeadBlock ({timing}){

	return (
		<header className="h"  id="head">
			<Parallax src="/images/background-head.jpg" k={-0.5} className="cover"/>
			<div className="container">
				<div className={cn(styles.top)}>
					<img className={styles.imageMap} src="/images/map.png" alt="Логотип лукойла"/>
					<div className={styles.title}>
						<h1>Энергия талантов</h1>
						<div>«ПермНИПИнефть»</div>
					</div>
					<img className={styles.imageLogo} src="/images/logo-f.png" alt="Лукойл-инжениринг"/>
				</div>
				<img className={styles.hitParad} src="/images/hit-parad.png" alt="Хит-парад"/>
				{stars.map((item, index) => <Star {...item} key={index}/>)}
			</div>

			<div className={cn(styles.buttons, "container")}>
				{menuItems.map((item, index) => <a href={item.to} onClick={onClick} key={index}>{item.title}</a>)}
			</div>

			<div className={styles.tableTop}>
				<button onClick={() => openYoutubeModal(video.id)}><img src="/images/play.svg" alt="Проиграть видео"/></button>
				<div>Голосование начнется<br/>в {getTime(timing.startVote)}</div>
			</div>
		</header>
	)
}

function Star ({style, title, to, className}){
	return (
		<div className={cn(styles.star, className)} style={style}>
			<a href={to} onClick={onClick}>{title}</a>
		</div>
	)
}