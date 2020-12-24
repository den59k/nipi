import React from 'react'
import useSWR from 'swr'
import { GET } from 'libs/fetch'


export default function StatsPage (){

	const { data } = useSWR('/api/watches', GET)

	return (
		<>
			<header style={{justifyContent: 'flex-start'}}>
				<h1 style={{marginRight: "20px"}}>Главная страница</h1>
			</header>

			<div className="chat-list">
				<table className="table">
					<thead>
						<tr>
							<th>Видеоролик</th>
							<th>Просмотры</th>
						</tr>
					</thead>
					{data && data.map((item, key) => (
						<tr>
							<td><a href={"https://youtu.be/"+item._id} target="_blank">{"https://youtu.be/"+item._id}</a></td>
							<td>{item.count}</td>
						</tr>
					))}
				</table>
			</div>
		</>
	)
}