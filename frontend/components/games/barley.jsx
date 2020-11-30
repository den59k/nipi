import { useState, useEffect } from 'react'
import styles from './barley.module.sass'

const cells = [];

const div = 3;

for(let y = 0; y < div; y++){
	for(let x = 0; x < div; x++)
		cells.push({x, y});
}
cells.pop();

const indexes = cells.map((item, index) => index);
indexes.push(null)


const moveElementX = (state, index, dir = 1) => {
	const nullable = state.findIndex(item => item === null);
	const newState = [...state];

	const y = Math.floor(index/div)

	if(Math.floor(nullable/div) === y && nullable < index && dir < 0){
		for(let i = nullable; i < index; i-=dir)
			newState[i] = newState[i+1];
		newState[index] = null;
	}

	if(Math.floor(nullable/div) === y && nullable > index && dir > 0){
		for(let i = nullable; i > index; i-=dir)
			newState[i] = newState[i-1];
		newState[index] = null;
	}

	return newState;
}

const moveElementY = (state, index, dir = 1) => {
	const nullable = state.findIndex(item => item === null);
	const newState = [...state];

	const x = index%div

	if(nullable%div === x && nullable < index && dir < 0){
		for(let i = nullable; i < index; i-=dir*div)
			newState[i] = newState[i+div];
		newState[index] = null;
	}

	if(nullable%div === x && nullable > index && dir > 0){
		for(let i = nullable; i > index; i-=dir*div)
			newState[i] = newState[i-div];
		newState[index] = null;
	}

	return newState;
}

let lastShuffle = -1;
const shuffleState = (state) => {
	const nullable = state.findIndex(item => item === null);

	let rand = Math.floor(Math.random()*4);;
	while(!(rand !== lastShuffle && (
				rand === 0 && nullable-div >= 0 || 
				rand === 1 && nullable%div !== div-1 || 
				rand === 2 && nullable+div < indexes.length || 
				rand === 3 && nullable%div !== 0
			))){
		rand++;
		if(rand >= 4)
			rand = 0;
	}

	if(rand === 0){
		lastShuffle = 2;
		return moveElementY(state, nullable-div, 1)
	}

	if(rand === 1){
		lastShuffle = 3;
		return moveElementX(state, nullable+1, -1)
	}

	if(rand === 2){
		lastShuffle = 0;
		return moveElementY(state, nullable+div, -1)
	}

	if(rand === 3){
		lastShuffle = 1;
		return moveElementX(state, nullable-1, 1)
	}

	return state;
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

	const onMouseDown = (_e, index) => {
		const _pos = [_e.clientX, _e.clientY];
		const move = (e) => {
			const pos = [e.clientX, e.clientY];
			const delta = pos.map((i, _i) => i-_pos[_i]);

			if(Math.abs(delta[0]) > 20){
				setPoses(state => moveElementX(state, index, Math.sign(delta[0])));
				document.removeEventListener('mousemove', move)
			}

			if(Math.abs(delta[1]) > 20){
				setPoses(state => moveElementY(state, index, Math.sign(delta[1])));
				document.removeEventListener('mousemove', move)
			}
		}

		document.addEventListener('mousemove', move);
		document.addEventListener('mouseup', () => document.removeEventListener('mousemove', move), {once: true});
	}

	const shuffle = () => {
		let counter = 0;
		const interval = setInterval(() => {

			setPoses(state => shuffleState(state));

			counter++;
			if(counter > 50)
				clearInterval(interval);
		}, 100);

	}

	return (
		<div>
			<div className={styles.container}>
				{cells.map((cell, index) => (
					<div className={styles.cell} key={cell.x+ " "+cell.y} style={{
						top: Math.floor(poses.indexOf(index)/div)*100/div+'%',
						left: poses.indexOf(index)%div*100/div+'%',
						width: 100/div+'%',
						height: 100/div+'%'
					}}>
						<button style={{backgroundImage: `url(${image})`, backgroundPosition: `${cell.x*100/(div-1)}% ${cell.y*100/(div-1)}%`}} 
							onMouseDown={e => onMouseDown(e, poses.indexOf(index))}>
						</button>
					</div>
				))}
			</div>
			<button className={styles.button} onClick={shuffle}>Перемешать</button>
		</div>
	);

}