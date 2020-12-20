import { useState, useEffect } from 'react'
import styles from './barley.module.sass'
import cn from 'classnames'

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
	if(newState[index] !== null) return state;
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
	if(newState[index] !== null) return state;
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

function getPos(e){
	if(e.touches)
		e = e.touches[0]
	return [ e.clientX, e.clientY ]
}

function isWin (poses){
	for(let i = 0; i < div*div-1; i++)
		if(poses[i] !== i) return false
	
	return true
}

function sign (delta){
	if(delta < 0) return -1
	if(delta > 0) return 1
	return 0
}

//Игра - пятнашки
export default function Barley ({src, className, onWin}){

	const [ poses, setPoses ] = useState(indexes)
	const [ steps, setSteps ] = useState(-1)
	const [ started, setStarted ] = useState(false)
	const [ played, setPlayed ] = useState(false)

	const image = src

	useEffect(() => {
		setSteps(steps => steps+1)
	}, [poses])

	useEffect(() => {
		if(started && isWin(poses)){
			setTimeout(onWin, 500)
			setStarted(false)
			setPlayed(false)
		}
	}, [poses, started])

	const onMouseDown = (_e, index) => {
		if(!started) return
		const _pos = getPos(_e);
	
		const move = (e) => {
			e.preventDefault()
			e.stopPropagation()
			const pos = getPos(e);
			const delta = pos.map((i, _i) => i-_pos[_i]);

			if(Math.abs(delta[0]) > 20){
				setPoses(state => moveElementX(state, index, sign(delta[0])));
				
				document.removeEventListener('mousemove', move)
				document.removeEventListener('touchmove', move)
			}

			if(Math.abs(delta[1]) > 20){
				setPoses(state => moveElementY(state, index, sign(delta[1])));
				document.removeEventListener('mousemove', move)
				document.removeEventListener('touchmove', move)
			}
			return false
		}
		
		if(_e.touches){
			document.addEventListener('touchmove', move, { passive: false });
			document.addEventListener('touchend', () => document.removeEventListener('touchmove', move), {once: true});
		}else{
			document.addEventListener('mousemove', move);
			document.addEventListener('mouseup', () => document.removeEventListener('mousemove', move), {once: true});
		}
	}

	const shuffle = () => {
		let counter = 0;
		setPlayed(true)
		const interval = setInterval(() => {

			setPoses(state => shuffleState(state));
			
			counter++;
			if(counter > 50){
				clearInterval(interval)
				setStarted(true)
				setSteps(0)
			}
		}, 100);

	}

	const clear = () => {
		setStarted(false)
		setTimeout(() => {
			setPoses(indexes)
			setPlayed(false)
		}, 100)
	}

	return (
		<div className={cn(className, styles.mainContainer)}>
			{/* <div className={styles.preview} style={{backgroundImage: `url(${image})`}}></div> */}
			<div className={styles.background}>
				<div className={styles.ice}><h3>Собери картинку</h3></div>
				<div className={styles.container}>
					{cells.map((cell, index) => (
						<div className={styles.cell} key={cell.x+ " "+cell.y} style={{
							top: Math.floor(poses.indexOf(index)/div)*100/div+'%',
							left: poses.indexOf(index)%div*100/div+'%',
							width: 100/div+'%',
							height: 100/div+'%'
						}}>
							<button style={{backgroundImage: `url(${image})`, backgroundPosition: `${cell.x*100/(div-1)}% ${cell.y*100/(div-1)}%`}} 
								onMouseDown={e => onMouseDown(e, poses.indexOf(index))} onTouchStart={e => onMouseDown(e, poses.indexOf(index))}>
							</button>
						</div>
					))}
				</div>
			</div>
			<div className={styles.panel}>
				<button style={{backgroundImage: 'url(/catcher/button-play.png)'}} className={cn(
					styles.playButton,
					played && styles.hide
				)} onClick={shuffle}></button>

				<button style={{backgroundImage: 'url(/images/games/again.png)', marginRight: "20px"}} className={cn(
					styles.playButton,
					!started  && styles.hide
				)} onClick={clear}></button>
				
				<div className={cn(!started && styles.hide)}>Ходы: {steps}</div> 
			</div>
		</div>
	);

}