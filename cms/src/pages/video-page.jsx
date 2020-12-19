import React from 'react'
import cn from 'classnames'
import { getTime } from 'libs/rus'
import useSWR, { mutate } from 'swr'
import { GET } from 'libs/fetch'


import { openModalVideo } from 'components/modal-window'
import { IoIosCheckmarkCircle, IoIosCloseCircle, IoIosVideocam } from 'react-icons/io'

const videos = [
	{ src: "/db/videos/video.mp4", preview: "/db/videos/preview.png", accepted: true },
	{ src: "/db/videos/video.mp4", preview: "/db/videos/preview.png", rejected: true },
	{ src: "/db/videos/video.mp4", preview: "/db/videos/preview.png" },
]

export default function VideoPage () {

	const { data } = useSWR('/api/videos', GET, { refreshInterval: 5000 })

	console.log(data)

	const onClickItem = (item) => {
		openModalVideo(item)
	}

	return (
		<>
			<header>
				<h1>Видео-поздравления</h1>
			</header>
			<div className="block-list">
				{data && data.map((item, index) => (
					<button className={cn("item", item.rejected && "rejected")} key={index} onClick={() => onClickItem(item)}>
						<img src={item.preview} alt="Превью-видео"/>
						<div className="icons">
							{ typeof item.seconds === 'number' && <div className="progress">{item.seconds}с.</div> }
							{ item.transcoded && <IoIosVideocam/> }
							{ item.accepted && <IoIosCheckmarkCircle/> }
							{ item.rejected && <IoIosCloseCircle color="red"/> }
						</div>
					</button>
				))}
			</div>
		</>
	)
}