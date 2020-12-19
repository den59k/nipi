import React from 'react'
import { useForm, Input, Segment } from 'controls';
import { Link } from 'react-router-dom'

export default function LoginPage() {

  const form = useForm();

  return (
    <div className="flex-center">
      <h1>StudyTracker</h1>
      <h2 className="text-center">Войдите в ваш аккаунт, чтобы<br/>получить доступ к учебной работе</h2>
      <form className="form thin text-center" style={{marginTop: "15px"}}>
        <Input name="email" form={form} className="filled"  placeholder="Логин"/>
        <Input name="password" type="password"  form={form} className="filled" placeholder="Пароль"/>
        <button className="button-stroked">Войти</button>
        <div className="h-line"></div>
        <Link to="/register">Создайте аккаунт прямо сейчас</Link>
      </form>
    </div>
  );
}
