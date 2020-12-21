import React from 'react'
import { useForm, Input, Segment } from 'controls';
import { REST } from 'libs/fetch'
import { mutate } from 'swr';

export default function AuthPage() {

	const form = useForm();

	const onSubmit = async (e) => {
		e.preventDefault()
		const values = form.values.toObject()
		if(!values.login || !values.password) return

		const response = await REST('/api/auth', values, 'POST')
		console.log(response)
		if(response.error) return form.setErrors(response.error)
		mutate('/api')
	}

	return (
		<div className="flex-center">
			<h1 style={{fontWeight: "300", fontSize: '3em'}}>Новогодний сайт</h1>
			<h2 style={{fontWeight: "300"}} className="text-center">Войдите в ваш аккаунт, чтобы<br/>получить доступ к управлению сайтом</h2>
			<form className="form thin text-center" style={{marginTop: "15px"}} onSubmit={onSubmit}>
				<Input name="login" form={form} className="filled"  placeholder="Логин"/>
				<Input name="password" type="password"  form={form} className="filled" placeholder="Пароль"/>
				<button className="button-stroked">Войти</button>
			</form>
		</div>
	);
}
