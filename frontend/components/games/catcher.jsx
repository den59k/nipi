import { useState, useEffect, useRef } from 'react'
import cn from 'classnames'

import styles from './catcher.module.sass'

function rand(max){
	return Math.floor(Math.random()*(max+1))
}

function getStyle(present){

	if(present.catch){
		return {
			bottom: 140+present.level*50+'px', 
			left: present.pos < 0? (330): 'auto',
			right: present.pos > 0? (315): 'auto',
			transform: `rotate(${present.pos<0 ? '40deg': '-40deg'})`,
			opacity: 0,
			backgroundImage: `url(/catcher/${present.pos < 0? 'left': 'right'}${present.type+1}.png)`
		}
	}

	if(present.fall){
		return {
			bottom: 20,
			left: present.pos < 0? (250): 'auto',
			right: present.pos > 0? (235): 'auto',
			opacity: 0,
			backgroundImage: `url(/catcher/${present.pos < 0? 'left': 'right'}${present.type+1}.png)`
		}
	}

	return {
		bottom: 286+present.level*108-present.step*53+'px', 
		left: present.pos < 0? (20+present.step*180): 'auto',
		right: present.pos > 0? (5+present.step*180): 'auto',
		backgroundImage: `url(/catcher/${present.pos < 0? 'left': 'right'}${present.type+1}.png)`
	}
}

let counter = 0;
export default function Catcher(){
	
	const [ pos, setPos ] = useState('left');
	const [ presents, setPresents ] = useState([]);
	const [ gameState, setGameState ] = useState({started: false, scores: 0, falls: 0, interval: null, timeout: null});

	const posRef = useRef();
	posRef.current = pos;

	const addPresent = () => {
		const newPresent = {id: counter++, level: rand(1), pos: Math.random() < 0.5?-1: 1, step: 0, type: rand(4), catch: false, fall: false};
		setPresents(state => [...state, newPresent]);
	}

	useEffect(() => {
		const keydown = (e) => {
			console.log(e.key);
			if(e.code === 'ArrowDown' || e.key === 'Down')
				setPos(state => (state === 'left' || state === 'left-up')?'left': 'right');

			if(e.code === 'ArrowUp' || e.key === 'Up')
				setPos(state => (state === 'left' || state === 'left-up')?'left-up': 'right-up');

			if(e.code === 'ArrowLeft' || e.key === 'Left')
				setPos(state => (state === 'left-up' || state === 'right-up')?'left-up': 'left');

			if(e.code === 'ArrowRight' || e.key === 'Right')
				setPos(state => (state === 'left-up' || state === 'right-up')?'right-up': 'right');

			if(e.code === 'Space' || e.key === 'Spacebar'){
				startGame();
			}

			if(e.code === 'ArrowDown' || e.code === 'ArrowUp' || e.code === 'ArrowLeft' || e.code === 'ArrowRight' || e.code === 'Space')
				e.preventDefault();
	
		}
		document.addEventListener('keydown', keydown)


		return () => {
			document.removeEventListener('keydown', keydown);
		}
	}, []);

	function startGame () {
		if(gameState.started === true) {
			clearInterval(gameState.interval);
			clearTimeout(gameState.timeout);
			setGameState(state => ({...state, started: false, interval: null, timeout: null}))
			setPresents([]);
			return
		}
		const interval = setInterval(() => {
			setPresents(state => state.map(item => {
				const newItem = {...item, step: item.step+0.01};

				if(newItem.step > 1 && item.catch === false && item.fall === false && posRef.current === ((item.pos < 0)?'left': 'right')+(item.level?'-up': '')){
					newItem.catch = true;
					setGameState(state => ({...state, scores: state.scores+1}));
					setTimeout(() => setPresents(state => state.filter(_item => _item.id !== item.id)), 300);
				}

				if(newItem.step > 1.05 && newItem.catch === false && newItem.fall === false){
					newItem.fall = true;
					setGameState(state => ({...state, falls: state.falls+1}));
					setTimeout(() => setPresents(state => state.filter(_item => _item.id !== item.id)), 400);
				}
				return newItem;
			}));
		}, 20);

		function spawn (){
			addPresent();

			setGameState(state => {
				if(!state.started) return state;
				const time = (Math.floor(Math.random()*100)+100)*40/Math.max(Math.sqrt(state.scores), 5);
				console.log(time);
				const timeout = setTimeout(spawn, time);
				return {...state, timeout};
			});
		}
		const timeout = setTimeout(spawn, 100);
		setGameState(state => ({started: true, interval, scores: 0, falls: 0, timeout}));
	}


	return (
		<div className={styles.container}>
			<div className={styles.game}>
				<div className={cn(styles.santa, styles[pos])}></div>
				{presents.map(present => (
					<div key={present.id} className={cn(styles.present, present.catch && styles.catch, present.fall && styles.fall)} style={getStyle(present)}>
					</div>
				))}
			</div>
			<div className={styles.buttonContainer}>
				<button style={{backgroundImage: 'url(/catcher/button-play.png)'}} className={styles.playButton} onClick={startGame}></button>
				<div>Пойманных подарков: {gameState.scores}</div>
				<div>Пропущенных подарков: {gameState.falls}</div>
			</div>
		</div>
	);
}