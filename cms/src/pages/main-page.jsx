import React from 'react'
import cn from 'classnames'
import useSWR, { mutate } from 'swr'
import { REST, GET } from 'libs/fetch'

import { IoIosSave } from 'react-icons/io'

import { useForm, TimePicker } from 'controls'

const defaultDate = new Date()
defaultDate.setMinutes(0)
defaultDate.setSeconds(0)
defaultDate.setHours(10)
defaultDate.setMilliseconds(0)
const ms = defaultDate.getTime()

const timing = {
	start: { label: "Начало работы сайта" },
	startVote: { label: "Начало голосования" },
	finishVote: { label: "Окончание голосования" },
	presents: { label: "Награждение" }
}

const defaultValues = {}
Object.keys(timing).map((key) => defaultValues[key] = ms)

export default function MainPage(){
	
	const { data: onlineData } = useSWR('/api', GET)

	const form = useForm(defaultValues)
	const { data } = useSWR('/api/timing', GET, {
		onSuccess: data => {
			if(data && !form.changed){ form.onChange(data); form.setChanged(false) }
		}
	})

	const save = async () => {
		const resp = await REST('/api/timing', form.values.toObject(), 'POST')
		if(!resp.errors) form.setChanged(false)
		mutate('/api/timing')
	}

	return (
		<>
			<header style={{justifyContent: 'flex-start'}}>
				<h1 style={{marginRight: "20px"}}>Главная страница</h1>
				<button className={cn("button-filled", !form.changed && "hide")} onClick={save}><IoIosSave/>Сохранить</button>
				<h2 style={{marginLeft: 'auto'}}>Сейчас на сайте: {onlineData && onlineData.online}</h2>
			</header>
			<div className="chat-list">
				{Object.keys(timing).map(key => (
					<div key={key} className="control-container">
						<TimePicker name={key} form={form} {...timing[key]}/>
					</div>
				))}
			</div>
		</>
	)
}

