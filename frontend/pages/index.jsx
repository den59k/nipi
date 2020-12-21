import { useEffect } from 'react'
import useSWR from 'swr'
import { GET } from 'libs/fetch'

import Layout from 'components/layout'
import HeadBlock from 'blocks/head'
import CongrulationsBlock from 'blocks/congrulations'
import ParticipantBlock from 'blocks/participant'
import PresentsBlock from 'blocks/presents'
import ChatBlock from 'blocks/chat'
import PhotoBlock from 'blocks/photo'
import GamesBlock from 'blocks/games'

import participants from 'libs/participants'

export default function MainPage({congrulations}) {

	const { data } = useSWR('/api', GET, { refreshInterval: 5000 })
  const _data = data || { photos: [],  messages: [], indexes: [], timing: {} }

	useEffect(() => {
		const resize = () => {
			if(window.innerHeight < 400 || window.innerWidth < 400) return
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		}
		resize()
		window.addEventListener("resize", resize)

		return () => window.removeEventListener("resize", resize)
	}, [])

	return (
		<Layout>
			<HeadBlock timing={_data.timing}/>
			<CongrulationsBlock/>
			{congrulations.map((item, index) => <ParticipantBlock 
				{...item} 
				key={index}
				headerClassName={index%2 === 0?"gray": "red"}
				preview={"/images/preview-"+(index+2)+".jpg"}
				index={index}
				likes={_data.likes && _data.likes[index]? _data.likes[index].likes : 0}
				liked={_data.indexes.find(item => item.index===index)}
				timing={_data.timing}
			/>)}
			<PresentsBlock timing={_data.timing}/>
			<ChatBlock messages={_data.messages}/>
			<PhotoBlock photos={_data.photos}/>
			<GamesBlock/>
		</Layout>
	)
}

import getData from 'libs/get-data'

export async function getStaticProps() {
	const props = await getData()
  return {
		props, // will be passed to the page component as props,
		revalidate: 1
  }
}
