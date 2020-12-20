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

export default function Stars (){

	const [ stars, setStars ] = useState(generateStars())

	return (
		<div className="stars">
			{stars.map((item, index) => (
				<img key={index} src="/images/star.png"	alt="Звезда" style={{
					marginRight: -item.right+'px', 
					marginTop: -item.top+'px',
					transform: `scale(${item.scale})`
				}}/>
			))}
		</div>
	)
}