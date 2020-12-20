import { useState, useRef, useEffect } from 'react'
import cn from 'classnames'
import { GET, REST } from 'libs/fetch'
import loadFile from 'libs/file-loader'
import { mutate } from 'swr'

import styles from './styles/chat.module.sass'

const fields = {
	name: { label: "Имя", className: styles.double },
	surname: { label: "Фамилия", className: styles.double },
	unit: { label: "Направление" },
}

export default function ChatBlock({messages}){

	const [ values, setValues ] = useState({})
	const [ disable, setDisable ] = useState(false)

	const chatRef = useRef()
	const fileRef = useRef()

	const length = messages.length

	useEffect(() => {
		chatRef.current.scrollTop = 9999
		chatRef.current.parentElement.scrollTop = 9999
	}, [length])	

	const onChange = (obj) => {
		setValues({...values, ...obj})
	}

	const onSubmit = async (e) => {
		e.preventDefault()
		if(disable) return
		setDisable(true)
	
		const response = await REST('/api/chat', values)

		setDisable(false)
		onChange({text: ""})
		mutate('/api')
	}

	const onFileChange = async (e) => {
		const file = e.target.files[0]
		if(!file) return
		e.target.value = ""

		const body = await loadFile(file)
		const headers = { 'Content-Type': file.type };

		const json = await fetch('/api/chat/upload', { method: 'POST', headers, body } )
		const resp = await json.json()
		
		if(resp.error) return
	
		onChange({avatar: resp.src})
	}


	return (
		<div className={cn("h flex", styles.background)} id="chat">
			<input onChange={onFileChange} ref={fileRef} type="file" accept="image/*" style={{display: "none"}}/>
			<h2>Новогодний чат</h2>
			<div className={cn('container', styles.chatContainer)}>
				<button 
					className={cn(styles.avatar, styles.desktop, values.avatar && styles.active)} 
					onClick={() => fileRef.current.click()} 
					style={values.avatar?{backgroundImage: `url(${values.avatar})`}: {}}
				></button>
				<div className={styles.chat} ref={chatRef}>
					{messages.map((item, index) => <Message key={index} {...item}/>)}
				</div>
			</div>
			<form className={cn('container', styles.inputsContainer)} onSubmit={onSubmit}>
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
				<button 
					className={cn(styles.avatar, styles.mobile, values.avatar && styles.active)} 
					onClick={() => fileRef.current.click()} 
					style={values.avatar?{backgroundImage: `url(${values.avatar})`}: {}}
				></button>
			</form>
		</div>
	)
}

function Message ({name, surname, unit, text, avatar}){

	return (
		<div className={styles.message}>
			<div className={styles.messageAvatar} style={avatar?{backgroundImage: `url(${avatar})`}:{}}></div>
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