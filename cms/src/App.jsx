import React from 'react'
import useSWR from 'swr'
import { GET, POST } from 'libs/fetch'
import Layout from 'components/layout'
import { BrowserRouter as Router } from 'react-router-dom'
import { IoIosHome, IoIosChatbubbles, IoIosCamera, IoIosVideocam, IoMdPaper } from 'react-icons/io'

import AuthPage from 'pages/auth-page'
import MainPage from 'pages/main-page'
import ChatPage from 'pages/chat-page'
import PhotoPage from 'pages/photo-page'
import VideoPage from 'pages/video-page'
import ServicesPage from 'pages/services-page'

const menu = [
	{ icon: <IoIosHome/>, title: "Главная страница", to: "/", component: <MainPage/> },
	{ icon: <IoMdPaper/>, title: "Поздравления", to: "/congrulations", component: <ServicesPage/> },
	{ icon: <IoIosChatbubbles/>, title: "Поздравления в чате", to: "/chat", component: <ChatPage/> },
	{ icon: <IoIosCamera/>, title: "Фото-поздравления", to: "/photo", component: <PhotoPage/> },
	{ icon: <IoIosVideocam/>, title: "Фото-поздравления", to: "/video", component: <VideoPage/> }
]	

export default function App() {
	
	const { data } = useSWR('/api', GET)

	if(!data) return <div></div>

	if(data.error) return <AuthPage/>
	
	return (
		<Router>
			<Layout menu={menu}>
			</Layout>
		</Router>
	);
}
