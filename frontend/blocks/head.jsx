import cn from 'classnames'

import styles from './styles/head.module.sass'

import Link from 'next/link'

const stars = [
	{ title: "АУП и ВП", to: "/#aup", style: { top: '-200px', left: '0px' } },
	{ title: "РАЗРАБОТКА", to: "/#aup", style: { top: '-350px', left: '100px' } },
	{ title: "ПИР", to: "/#aup", style: { top: '-100px', left: '160px' } },
	{ title: "БУРЕНИЕ", to: "/#aup", style: { top: '-300px', right: '120px' } },
	{ title: "ГЕОЛОГИЯ", to: "/#aup", style: { top: '-150px', right: '0px' } },
	{ title: "ДОБЫЧА", to: "/#aup", style: { top: '-80px', right: '180px' } }
]

const menuItems = [
	{ title: "Новогодняя фотогалерея", to: "/#aup" },
	{ title: "Новогодняя игротека", to: "/#aup" },
	{ title: "Новогодняя поздравления", to: "/#aup" },
	{ title: "Подарки\nот деда мороза", to: "/#aup" },
	{ title: "Новогодний\nчат", to: "/#aup" },
]

export default function HeadBlock (){

	return (
		<header className="h" style={{backgroundImage: `url(/images/background-head.jpg)`}}>
			<div className="container">
				<div className={cn(styles.top)}>
					<img className={styles.imageMap} src="/images/map.png" alt="Логотип лукойла"/>
					<div className={styles.title}>
						<h1>Энергия талантов</h1>
						<div>«ПермНИПИнефть»</div>
					</div>
					<img className={styles.imageLogo} src="/images/logo-full.png" alt="Лукойл-инжениринг"/>
				</div>
				<img className={styles.hitParad} src="/images/hit-parad.png" alt="Хит-парад"/>
				{stars.map((item, index) => <Star {...item} key={index}/>)}
			</div>

			<div className={cn(styles.buttons, "container")}>
				{menuItems.map((item, index) => (
					<Link href={item.to} key={index}>
						<a>{item.title}</a>
					</Link>
				))}
			</div>

			<div className={styles.tableTop}><div>Голосование начнется<br/>в 10:00</div></div>
		</header>
	)
}

function Star ({style, title, to}){
	return (
		<div className={styles.star} style={style}>
			<Link href={to}>
				<a>{title}</a>
			</Link>
		</div>
	)
}