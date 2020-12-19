import React from 'react'

function getElement (element){
	
}

export function Block (props){

	console.log(props)

	return (
		<div className="block-container">
			<h3>{props.title}</h3>
		</div>
	)
}

export default function BlockSystem({blocks}){

	return (
		<div className="blocks-system">
			{Object.keys(blocks).map(key => (
				<Block key={key} {...blocks[key]}/>
			))}
		</div>
	)
}