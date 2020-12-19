import React from 'react'
import cn from 'classnames'
import { getTime } from 'libs/rus'
import useSWR, { mutate } from 'swr'
import { GET, REST } from 'libs/fetch'

import { openModalPhoto } from 'components/modal-window'
import { IoIosCheckmarkCircle, IoIosCloseCircle } from 'react-icons/io'

const photos = [
	{ src: "/db/photos/test.jpg", preview: "/db/photos/preview.jpg", accepted: false },
	{ src: "/db/photos/test.jpg", preview: "/db/photos/preview.jpg", rejected: true },
]

export default function PhotoPage () {

	const { data } = useSWR('/api/photos', GET)

	console.log(data)

	const onClickItem = (item) => {
		openModalPhoto(item)
	}

	return (
		<>
			<header>
				<h1>Фото-поздравления</h1>
			</header>
			<div className="block-list">
				{data && data.map((item, index) => (
					<button className={cn("item", item.rejected && "rejected")} key={index} onClick={() => onClickItem(item)}>
						<img src={item.preview} alt="Изображение"/>
						<div className="icons">
							{ item.accepted && <IoIosCheckmarkCircle/> }
							{ item.rejected && <IoIosCloseCircle color="red"/> }
						</div>
					</button>
				))}
			</div>
		</>
	)
}