import { useEffect, useState } from 'react'
import onClick from 'libs/smooth-href'
import cn from 'classnames'

import Head from 'next/head'
import { ModalWrapper } from 'components/modal-window'

export default function Layout ({children}){


	return (
		<ModalWrapper>
			<Head>
				<title>Энергия талантов ПермНИПИнефть</title>
				<link rel="icon" href="/favicon.png" />
			</Head>
			{children}
			<UpButton/>
		</ModalWrapper>
	)
}


function UpButton(){

	const [ show, setShow ] = useState(false)

	useEffect(() => {
		const scroll = () => {
			setShow(window.pageYOffset > 500)
		}
		document.addEventListener('scroll', scroll)
		return () => document.removeEventListener('scroll', scroll)
	}, [])

	return (
		<a className={cn("up-button", !show && "hide")} href="/#head" onClick={onClick}></a>
	)
}