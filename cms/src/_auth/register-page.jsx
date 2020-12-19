import React, {useEffect} from 'react'
import { useForm, Input, Segment } from 'controls';

export default function RegisterPage() {

  const form = useForm({role: 0});


  return (
    <div className="flex-center">
      <h1>StudyTracker</h1>
      <form className="form text-center">
        <h2>Получите доступ к работе,<br/> создав свой аккаунт прямо сейчас</h2>
        <Input name="email" form={form} label="Email" placeholder="Ваш логин"/>
        <Input name="name"  label="Имя"  form={form} placeholder="Ваше имя"/>
        <Input name="surname" label="Фамилия"  form={form} placeholder="Ваша фамилия"/>
        <Segment name="role" options={["Студент", "Преподаватель"]} form={form}/>
        <button className="button-stroked">Продолжить</button>
      </form>
    </div>
  );
}
