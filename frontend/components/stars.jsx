import { useState } from 'react'

function rand (max){
	return Math.floor(Math.random() * max)
}

function generateStars () {
	const count = rand(3)+1
	const stars = []

	for(let i = 0; i < count; i++){
		stars.push({ right: rand(30), top: rand(20), scale: Math.random()*1 + 0.2 })
	}

	return stars
}

const starsList = [
	[{ scale: 0.8, right: 40 }, { scale: 0.4 }],
	[{ scale: 0.3, right: 80 }, { scale: 0.8, top: 40 }],
	[{ scale: 0.8, right: 40 }, { scale: 0.4 }],
	[{ scale: 0.8, right: 40, top: 10 }, { scale: 0.4, right: 50 },  { scale: 0.9, top: 30 } ],
]

function round(k, max){
	if(k >= max)
		return k % max
	return k
}

export default function Stars ({index}){

	const stars = starsList[round(index || 0, starsList.length)]

	return (
		<div className="stars">
			{stars.map((item, index) => (
				<img key={index} src="/images/star.png"	alt="Звезда" style={{
					marginRight: -(item.right || 0)+'px', 
					transform: `translateY(${item.top || 0}px) scale(${item.scale || 1})`
				}}/>
			))}
		</div>
	)
}