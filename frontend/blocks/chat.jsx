import { useState } from 'react'
import cn from 'classnames'
import styles from './styles/chat.module.sass'

const messages = [
	{ 
		name: "Анастасия", 
		surname: "Швецова", 
		unit: "Программист", 
		text: "С Новым годом! Пусть за окном будет сказка, а в доме — атмосфера счастья!"
	},
	{ 
		name: "Анастасия", 
		surname: "Швецова", 
		unit: "Программист", 
		text: "С Новым годом! Пусть за окном будет сказка, а в доме — атмосфера счастья!"
	}
]

const fields = {
	name: { label: "Имя", className: styles.double },
	surname: { label: "Фамилия", className: styles.double },
	unit: { label: "Направление" },
}

export default function ChatBlock(){

	const [ values, setValues ] = useState({})

	const onChange = (obj) => {
		setValues({...values, ...obj})
	}

	return (
		<div className={cn("h flex", styles.background)}>
			<h2>Новогодний чат</h2>
			<div className={cn('container', styles.chatContainer)}>
				<button className={styles.avatar}>

				</button>
				<div className={styles.chat}>
					{messages.map((item, index) => <Message key={index} {...item}/>)}
				</div>
			</div>
			<div className={cn('container', styles.inputsContainer)}>
				<div className={styles.fields}>
					{Object.keys(fields).map(key => (
						<Input {...fields[key]} name={key} key={key} subName="chat" onChange={onChange} value={values[key]}/>
					))}
				</div>
				<Input 
					className={styles.textarea} 
					label="Текст поздравления" 
					name="text" 
					subName="chat" 
					onChange={onChange} 
					value={values.text} 
					area={true}
				/>
				<button className={styles.send}><img src="/images/send.svg" alt="Отправить сообщение"/></button>
			</div>
		</div>
	)
}

function Message ({name, surname, unit, text}){

	return (
		<div className={styles.message}>
			<div className={styles.messageAvatar}></div>
			<div className={styles.textContainer}>
				<div className={styles.header}>
					<div className={styles.name}>{name} {surname}</div>
					<div className={styles.unit}>{unit}</div>
				</div>
				<div className={styles.text}>{text}</div>
			</div>
		</div>
	)
}


function Input ({label, name, subName, onChange, value, area, className}){
	
	const _onChange = (e) => {
		onChange({[name]: e.currentTarget.value})
	}

	return (
		<div className={cn(styles.input, className)}>
			<label htmlFor={subName+"-"+name}>{label}</label>
			{!area?(
				<input id={"#"+subName+"-"+name} name={name} onChange={_onChange} value={value || ""}/>
			):(
				<textarea id={"#"+subName+"-"+name} name={name} onChange={_onChange} value={value || ""}/>
			)}
		</div>
	)
}