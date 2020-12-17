import cn from 'classnames'
import { useResize } from 'libs/resize'

import styles from './styles/photo.module.sass'

const photos = [
	{ src: "/db/photos/1.jpg", preview: "/db/photos/1.jpg" },
	{ src: "/db/photos/1.jpg", preview: "/db/photos/1.jpg" },
	{ src: "/db/photos/1.jpg", preview: "/db/photos/1.jpg" }
]

const resizing = [
	{ min: 1200, value: 12 },
	{ min: 900, value: 8 },
	{ min: 0, value: 4 }
]

function getPhotos (photos, start, end, onPhotoClick){
	if(!photos) return []
	const arr = photos.slice(start, end).map((item, index) => (
		<button 
			key={index} 
			className={styles.photo} 
			onClick={() => onPhotoClick(start+index)}
			style={{backgroundImage: `url(${item.preview})`}}
		></button>
	))

	const len = arr.length
	for(let i = len; i < end-start; i++)
		arr.push( <div key={i} className={styles.photo} style={{backgroundImage: `url(/images/preview-gallery.jpg)`}}></div> )

	return arr
}

export default function ParticipantBlock ({ headerClassName, likes, name, text, leader, role, id, preview }){

	const count = useResize(resizing)

	const onPhotoClick = (item, index) => {

	}

	return (
		<div className={cn("h flex", styles.background)}>
			<h2>Новогодняя фотогалерея</h2>
			<div className={cn("content container", styles.container)}>
				<div className={styles.photosContainer}>
					<div className={styles.photos}>{getPhotos(photos, 0, count, onPhotoClick)}</div>
					<div className={styles.bigPhoto} style={{backgroundImage: `url(${photos[0].preview})`}}></div>
					<div className={styles.photos}>{getPhotos(photos, count, count*2, onPhotoClick)}</div>
				</div>
				<button className={cn("mega-button", styles.button)}>Сделать праздничное фото</button>
			</div>
		</div>
	)
}