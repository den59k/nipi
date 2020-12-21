import React, { useEffect, useMemo, useState } from 'react'
import useSWR, { mutate } from 'swr'
import cn from 'classnames'
import { getPreview, getId, toYoutube } from 'libs/youtube'
import { closeModal, openModal, openModalConfirm } from 'components/modal-window'

import ListContainer from 'components/list-container'
import { IoIosAdd, IoMdTrash, IoIosPlayCircle, IoMdCreate } from 'react-icons/io'
import { GET, REST } from 'libs/fetch'


const services = [
	{ id: 1, title: "BonVoyage", text: `Главный герой игры — Медведь с реактивным ранцем за спиной.
	Ваша задача петь популярную песню и с помощью...` },
	{ id: 2, title: "Торопыжка", text: `Главный герой игры — Медведь с реактивным ранцем за спиной.
	Ваша задача петь популярную песню и с помощью...` },
]

const cases = [
	{ type: "youtube", id: "JGwWNGJdvx8" },
	{ type: "image", src: "/images/1.jpg" },
	{ type: "image", src: "/images/2.jpg" }
]


const firstCategory = {
	_id: "0",
	title: "Все",
}

const addCategoryModal = {
	title: { type: "text", label: "Название", placeholder: "Направление" },
	youtube: { type: "text", label: "Youtube URL", placeholder: "youtube" }
}

function addOrUpdateCategory(item){

	return async (values, form) => {
		if(!values.title) return form.setErrors({title: "Название направления должно быть заполнено!"})
		if(values.youtube) values.youtube_id = getId(values.youtube)

		const resp = await REST(item?('/api/congrulations/'+item._id): '/api/congrulations', values, item?'PUT': 'POST')
		console.log(resp)
		//if(resp.error) return form.setErrors(resp.error)
		mutate('/api/congrulations')
		closeModal()
	}
}

function addOrUpdateProject(selectedCategory, index){
	console.log(index)
	return async (values, form) => {

		const resp = await REST(
			'/api/congrulations/'+selectedCategory._id+'/wishes/'+(typeof index === 'number'? index: ''), 
			values, 
			typeof index === 'number'? 'PUT': 'POST'
		)
		if(resp.error) return form.setErrors(resp.error)
		mutate('/api/congrulations')
		closeModal()
	}
}

const addProjectModal = {
	name: { type: "text", label: "Имя человека", placeholder: "ФИО" },
	role: { type: "text", label: "Должность", placeholder: "Должность" },
	wish: { type: "textarea", rows: 10, placeholder: "Поздравление" }
}

const deleteCategory = async (_id) => {
	const resp = await REST('/api/congrulations/'+_id, {}, 'DELETE')
	if(resp.error) return console.log(resp)
	mutate('/api/congrulations')
	closeModal()
}

const deleteProject = async (category, index) => {
	const resp = await REST('/api/congrulations/'+category+'/wishes/'+index, {}, 'DELETE')
	if(resp.error) return console.log(resp)
	mutate('/api/congrulations')
	closeModal()
}

export default function ServicesPage (){

	const [ category, selectCategory ] = useState()
	const [ project, selectProject ] = useState()

	const addCategory = () => openModal("Добавление направления", addCategoryModal, addOrUpdateCategory())
	
	const categoriesMenuItem = [
		{ title: "Редактировать направление", icon: <IoMdCreate/>, onClick: item => {
			openModal("Изменение направления", addCategoryModal, addOrUpdateCategory(item), toYoutube(item))
		}},
		{ title: "Удалить направление", icon: <IoMdTrash/>, onClick: (item) => {
			openModalConfirm('Удалить направление?', item.title, () => deleteCategory(item._id))
		}}
	]

	const projectsMenuItem = [
		{ title: "Редактировать поздравление", icon: <IoMdCreate/>, onClick: (item, index) => {
			openModal("Изменение поздравления", addProjectModal, addOrUpdateProject(category, index), item)
		}},
		{ title: "Удалить поздравление", icon: <IoMdTrash/>, onClick: (item, index) => {
			openModalConfirm('Удалить поздравление?', item.name, () => deleteProject(category._id, index))
		}}
	]

	const addProject = () => (category && category._id)?
		openModal("Добавление поздравления", addProjectModal, addOrUpdateProject(category)):
		null

	const { data } = useSWR('/api/congrulations', GET, { onSuccess: data => {
		selectCategory(lastCategory => {
				if(!lastCategory) return null;
				const newCategory = data.find(item => item._id === lastCategory._id)

				selectProject(project => {
					if(!project || !Array.isArray(newCategory.projects)) return null;
					return newCategory.projects.find(item => item.url === project.url)
				})

				return newCategory
				
			})
	}})
	
	return (
		<>
			<header>
				<h1>Услуги</h1>
			</header>
			<div className="services-blocks">
				<ListContainer 
					items={data} 
					title="Направления" 
					onAdd={addCategory} 
					menuItems={categoriesMenuItem} 
					onSelect={selectCategory}
					selectedItem={category}
					keyItem="_id"
				/>
				{category && (
					<ListContainer 
						items={category?category.wishes: []} 
						title="Поздравления" 
						onAdd={addProject} 
						menuItems={projectsMenuItem} 
						selectedItem={project}
						keySub="role"
					/>
				)}
				{project && (<ServiceContainer category={category} project={project} services={services} cases={cases}/>)}
			</div>
		</>
	)
}


function addOrUpdateService(selectedCategory, selectedProject, index){

	return async (values, form) => {
		if(!values.title) return form.setErrors({title: "Название услуги должно быть заполнено!"})
		const resp = await REST(
			'/api/services/'+selectedCategory.url+'/'+selectedProject.url+'/'+(index !== undefined?index: ''), 
			values, index !== undefined?'PUT': 'POST'
		)
		if(resp.error) return form.setErrors(resp.error)
		mutate('/api/services')
		closeModal()
	}
}

const addServiceModal = {
	title: { type: "text", label: "Название услуги", placeholder: "Услуга" },
	text: { type: "textarea", rows: 5, placeholder: "Текст услуги" }
}

const galleryModal = {
	title: { type: "text", label: "Название проекта", placeholder: "Проект" }
}

function ServiceContainer ({project, category, cases}){

	const addService = () => {
		openModal("Добавление услуги", addServiceModal, addOrUpdateService(category, project));
	}

	return (
		<div className="block-container" style={{flex: "1 1 auto"}}>
			<div className="block-header">
				<h3>{project.title}</h3>
				<button className={cn("button-filled")} onClick={addService}><IoIosAdd/>Добавить услугу</button>
			</div>
			<div className="list-container" style={{margin: "10px 0"}}>
			{project.services && project.services.map((item, index) => (
				<div className="list-item" key={index}>
					<button onClick={() => openModal("Изменение услуги", addServiceModal, addOrUpdateService(category, project, index), item)}>
						<div className="title">{item.title}</div>
						<div className="sub">{item.text}</div>
					</button>
				</div>
			))}
			</div>
			
		</div>
	)
}
