import { useState } from 'react'
import cn from 'classnames'
import { useResize } from 'libs/resize'
import { mutate } from 'swr'

import styles from './styles/photo.module.sass'

import { Parallax } from 'components/parallax'
import { openMakePhotoModal, closeModal } from 'components/modal-window'

const resizing = [
	{ min: 1200, value: 12 },
	{ min: 450, value: 8 },
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

export default function PhotoGalleryBlock ({ photos }){

	const [ currentPhoto, setCurrentPhoto ] = useState(0)
	const count = useResize(resizing)

	const onPhotoClick = (index) => {
		setCurrentPhoto(index)
	}

	const onMakePhoto = () => {
		openMakePhotoModal(async (buffer) => {
			const json = await fetch('/api/photos/upload', { method: 'POST', body: buffer })
			const response = await json.json()
			mutate('/api')
			closeModal()
		})
	}	

	return (
		<div className={cn("h flex", styles.background)} id="photo-gallery">
			<Parallax src="/images/background-gallery.jpg" k={-0.5} className="cover"/>
			<h2>Новогодняя фотогалерея</h2>
			<div className={cn("content container", styles.container)}>
				<div className={styles.photosContainer}>
					<div className={styles.photos}>{getPhotos(photos, 0, count, onPhotoClick)}</div>
					<div className={styles.bigPhoto} style={{
						backgroundImage: `url(${photos[currentPhoto]?photos[currentPhoto].src:'/images/preview-gallery.jpg'
					})`}}></div>
					<div className={styles.photos}>{getPhotos(photos, count, count*2, onPhotoClick)}</div>
				</div>
				<button className={cn("mega-button", styles.button)} onClick={onMakePhoto}>Сделать праздничное фото</button>
			</div>
		</div>
	)
}