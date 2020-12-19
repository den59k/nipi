import React, { Fragment } from 'react'
import { lang } from 'libs/constants'

import { useForm, Segment } from 'controls'

export default function LayoutContent (props){
		
	const form = useForm({lang: "ru"})

	const Component = props.component

	return (
		<>
			<header>
				<h1>{props.title}</h1>
				<Segment name="lang" form={form} options={lang}/>
			</header>
			<Component lang={form.get("lang")}/>
		</>
	)
}