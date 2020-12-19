import cn from 'classnames'
import { modal } from './index'

import styles from './modal.module.sass'

function GameModal ({title, text}){

	return (
		<div className={cn(styles.modal, styles.game)}>
			{title && <h3>{title}</h3>}
			<div>{text}</div>
			<button className="mega-button" onClick={modal.close}>ОК</button>
		</div>
	)
}

export function openGameModal (title, text, onClose){
	modal.open(<GameModal title={title} text={text}/>, onClose)
}