import { useState, useEffect } from 'react'
import styles from './barley.module.sass'

const cells = [];

for(let y = 0; y < 4; y++){
	for(let x = 0; x < 4; x++)
		cells.push({x, y});
}
cells.pop();

const indexes = cells.map((item, index) => index);
indexes.push(null)

const moveY = (state, dir = 1) => {
	const index = state.findIndex(item => item === null)
	const x = index%4
	const y = Math.floor(index/4)

	const newState = [];
	for(let i = 0; i < state.length; i++){
		if(i%4 === x && (i === index || dir > 0 && i/4 > y || dir < 0 && i/4 < y))
			if(i+4*dir >= state.length || i+4*dir < 0)
				newState.push(null)
			else
				newState.push(state[i+4*dir]);
		else
			newState.push(state[i])
	}

	return newState;
}

const moveX = (state, dir = 1) => {
	const index = state.findIndex(item => item === null)
	const x = index%4
	const y = Math.floor(index/4)

	const newState = [];
	for(let i = 0; i < state.length; i++){
		if(Math.floor(i/4) === y && (i === index || dir > 0 && i%4 > x || dir < 0 && i%4 < x))
			if(i%4 === 0 && dir < 0 || i%4 === 3 && dir > 0)
				newState.push(null)
			else
				newState.push(state[i+dir]);
		else
			newState.push(state[i])
	}

	return newState;
}

//Игра - пятнашки
export default function Barley (){

	const [poses, setPoses] = useState(indexes)

	const image = "/lukoil.jpg"

	useEffect(() => {
		const keydown = (e) => {
			if(e.code === 'ArrowUp')
				setPoses(state => moveY(state, 1))
			if(e.code === 'ArrowDown')
				setPoses(state => moveY(state, -1))
			if(e.code === 'ArrowLeft')
				setPoses(state => moveX(state, 1))
			if(e.code === 'ArrowRight')
				setPoses(state => moveX(state, -1))

		};

		document.addEventListener('keydown', keydown);

		return () => document.removeEventListener('keydown', keydown);
	}, []);

	return (
		<div className={styles.container}>
			{cells.map((cell, index) => (
				<div className={styles.cell} key={cell.x+ " "+cell.y} style={{top: Math.floor(poses.indexOf(index)/4)*25+'%',left: poses.indexOf(index)%4*25+'%' }}>
					<div style={{backgroundImage: `url(${image})`, backgroundPosition: `${cell.x*33}% ${cell.y*33}%`}}>
						
					</div>
				</div>
			))}
		</div>
	);

}