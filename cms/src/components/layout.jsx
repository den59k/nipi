import "styles/layout.sass"
import React from 'react'
import cn from 'classnames'

import { ModalWrapper } from 'components/modal-window'
import { Link, useLocation } from 'react-router-dom'

export default function Layout ({menu}){

	const { pathname } = useLocation();
	const activePage = menu.reduce((prev, item, index) => pathname.startsWith(item.to)?item: prev, menu[0])

	return (
		<ModalWrapper className="main">
			<nav>
				{menu.map(item => (
					<Link key={item.to} to={item.to} title={menu.name} className={cn(item === activePage && "active")}>
						{item.icon}
					</Link>
				))}
			</nav>
			<div className="content">
				{activePage.component}
			</div>
		</ModalWrapper>
	)
}