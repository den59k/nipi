import Layout from 'components/layout'
import HeadBlock from 'blocks/head'
import CongrulationsBlock from 'blocks/congrulations'
import ParticipantBlock from 'blocks/participant'
import PresentsBlock from 'blocks/presents'
import ChatBlock from 'blocks/chat'
import PhotoBlock from 'blocks/photo'
import GamesBlock from 'blocks/games'

import participants from 'libs/participants'

export default function Home() {
	return (
		<Layout>
			<HeadBlock/>
			<CongrulationsBlock/>
			{participants.map((item, index) => <ParticipantBlock 
				{...item} 
				key={index}
				headerClassName={index%2 === 0?"gray": "red"}
				preview={"/images/preview-"+(index+2)+".jpg"}
			/>)}
			<PresentsBlock/>
			<ChatBlock/>
			<PhotoBlock/>
			<GamesBlock/>
		</Layout>
	)
}
