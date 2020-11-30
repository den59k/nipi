import Link from 'next/link'
import controlStyles from 'styles/controls.module.sass'

export default function Home() {
	return (
		<div>
			<Link href="/catcher">
				<a className={controlStyles.link}>ЛОВЕЦ</a>
			</Link>

			<Link href="/barley">
				<a className={controlStyles.link}>ПЯТНАШКИ</a>
			</Link>
		</div>
	)
}
