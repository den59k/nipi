//Это базовый компонент, который создает страницу с блоками
import React, { useMemo } from 'react'
import { lang } from 'libs/constants'
import cn from 'classnames'
import { GET, REST } from 'libs/fetch'
import useSWR, { mutate } from 'swr'

import { getControl, useForm, Segment } from 'controls'

import { IoIosSave } from 'react-icons/io'



function getDefaultValues(controls){
	const obj = {};
	for(let key in controls)
		if("default" in controls[key])
			obj[key] = controls[key].default;
	
	return obj;
}

export function Block ({title, controls, name, page, lang}){

	const url = `/api/blocks/${page}/${name}/${lang}`
	
	const defaultValues = useMemo(() => getDefaultValues(controls), [ controls ])
	
	const { data } = useSWR(url, GET, {
		onSuccess: data => {
			if(!form.changed){ form.onChange(data); form.setChanged(false) }
		}
	})

	const form = useForm(data? {...defaultValues, ...data}:  defaultValues)
	
	const save = async () => {
		const values = form.values.toObject();

		const response = await REST(url, values, 'PUT')
		if(!response.error){
			form.setChanged(false)
			mutate(url)
		}
	}

	return (
		<div className={cn("block-container", !data && "hidden")}>
			<div className="block-header">
				<h3>{title}</h3>
				<button className={cn("button-filled", !form.changed && "hide")} onClick={save}><IoIosSave/>Сохранить</button>
			</div>
			{Object.keys(controls).map((key) => (
				<div key={key} className="control-container">
					{getControl(key, controls[key], form)}
				</div>
			))}
		</div>
	)
}


export default function BlockPage({blocks, title, children, page}){

	const form = useForm({lang: "ru"})

	return (
		<>
			<header>
				<h1>{title}</h1>
				<Segment name="lang" form={form} options={lang}/>
			</header>
			<div className="blocks-system">
				{Object.keys(blocks).map(key => (
					<Block key={key+form.get("lang")} {...blocks[key]} name={key} page={page} lang={form.get("lang")}/>
				))}
			</div>
			{children}
		</>
	)
}