import React, { useMemo } from 'react'
import cn from 'classnames'
import { getTime } from 'libs/rus'
import useSWR, { mutate } from 'swr'
import { GET, REST } from 'libs/fetch'

import { Input, useForm } from 'controls'
import { IoIosSearch, IoMdTrash } from 'react-icons/io'

export default function ChatPage () {
	const { data } = useSWR('/api/chat', GET)

	const form = useForm({search: ""})
	
	const search = form.get("search").toLowerCase()
	const chatMessages = useMemo(() => {
		if(!data) return []
		if(search) return data.filter(item => item.text.toLowerCase().includes(search))
		return data
	})

	const accept = async (item) => {
		const resp = await REST('/api/chat/'+item._id, { accepted: true, rejected: false }, 'PUT')
		if(!resp.error) mutate('/api/chat')
	}

	const reject = async (item) => {
		const resp = await REST('/api/chat/'+item._id, { accepted: false, rejected: true }, 'PUT')
		if(!resp.error) mutate('/api/chat')
	}

	const onDelete = async (item) => {
		const resp = await REST('/api/chat/'+item._id, {}, 'DELETE') 
		if(!resp.error) mutate('/api/chat')
	}

	return (
		<>
			<header>
				<h1>Поздравления в чате</h1>
			</header>
			<div className="chat-list">
				<Input name="search" type="text" placeholder="Поиск" className="filled search" form={form} icon={<IoIosSearch/>}/>
				{chatMessages.map((item, index) => (
					<div className="chat-item" key={index}>
						<div className="avatar" style={item.avatar?{backgroundImage: `url(${item.avatar})`}:{}}></div>
						<div className="message">
							<div className="header">
								<div className="name">{item.name} {item.surname}</div>
								<div className="unit">{item.unit}</div>
								<div className="time">{getTime(item.time)}</div>
							</div>
							<div className="text">{item.text}</div>
							<div className="buttons">
								{item.accepted?(
									<div className="label green">Одобрено</div>
								):(
									<button className="button-filled" onClick={() => accept(item)}>Одобрить</button>
								)}

								{item.rejected?(
									<div className="label red">Запрещено</div>
								):(
									<button className="button-filled red" onClick={() => reject(item)}>Запретить</button>
								)}

								<button className="delete" title="Удалить отзыв" onClick={() => onDelete(item)}><IoMdTrash/></button>
							</div> 
						</div>
					</div>
				))}
			</div>
		</>
	)
}