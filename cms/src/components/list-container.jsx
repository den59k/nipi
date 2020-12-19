import React, { useEffect, useMemo, useState } from 'react'
import cn from 'classnames'

import { useForm, Input } from 'controls'
import { IoIosAdd, IoIosSearch, IoMdMore } from 'react-icons/io'

function find(items, _search){
	if(!_search || !items) return items;

	const search = _search.toLowerCase();

	return items.filter(item => (item.title || item.name).toLowerCase().startsWith(search));
}


export default function ListContainer (props){

	const form = useForm()
	const [ menu, setMenu ] = useState(null)
	const search = form.get("search")

	const data = useMemo(() => find(props.items, search), [props.items, search])

	useEffect(() => {
		if(menu !== null){
			const _menu = menu
			const close = (e) => setMenu((lastMenu) => lastMenu === _menu? null: lastMenu)
			document.addEventListener('click', close)

			return () => document.removeEventListener('click', close)
		}
	}, [menu])

	const openMenu = (e, item, index) => {
		const top = e.currentTarget.parentElement.offsetTop;

		setMenu({top, item, index})
	}
	
	const keySub = props.keySub || "sub"
	return (
		<div className="block-container">
			<div className="block-header">
				<h3>{props.title}</h3>
				<button className={cn("button-filled")} onClick={props.onAdd}><IoIosAdd/>Добавить</button>
			</div>
			<Input name="search" type="text" placeholder="Поиск" className="filled search" form={form} icon={<IoIosSearch/>}/>
				
			{props.items && (
			<div className="list-container">
				{props.menuItems && menu && (
					<div className="list-menu" style={{top: menu.top}}>
						{props.menuItems.map((item, index) => (
							<button key={index} onMouseDown={item.onClick? (() => item.onClick(menu.item, menu.index)): null}>{item.title}{item.icon}</button>
						))}
					</div>
				)}
				{data.map((item, index) => (
					<div key={props.keyItem?item[props.keyItem]:index} className={cn(
						"list-item", 
						props.selectedItem && props.selectedItem[props.keyItem] === item[props.keyItem] && "selected"
					)}>
						<button onClick={props.onSelect && (() => props.onSelect(item, index))}>
							<div className="title">{item.title || item.name}</div>
							<div className="sub">{item[keySub]}</div>
						</button>
						<button className="more" onClick={(e) => openMenu(e, item, index)}>
							<IoMdMore/>
						</button>
					</div>
				))}
			</div>
			)}
		</div>
	)
}
