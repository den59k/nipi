import cn from 'classnames'
import { modal } from './index'

import styles from './modal.module.sass'

function CongrulationModal ({wish}){

	return (
		<div className={cn(styles.modal, styles.congrulation)}>
			<div className={styles.header}>
				<div className={styles.name}>{wish.name}</div>
				<div className={styles.unit}>{wish.role}</div>
			</div>
			<div className={styles.text}>{wish.wish}</div>
		</div>
	)
}

export function openCongrulationModal (wish){
	modal.open(<CongrulationModal wish={wish}/>)
}