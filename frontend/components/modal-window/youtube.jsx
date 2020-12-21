import cn from 'classnames'
import { modal } from './index'

import styles from './modal.module.sass'

function getHtml(id){
	return `
	<div class="wistia_responsive_padding" style="padding:56.25% 0 0 0;position:relative;">
	<div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;">
	<iframe src="https://fast.wistia.net/embed/iframe/${id}?videoFoam=true&autoplay=1" title="Видеоролик ПермьНИПИ" allow="autoplay; fullscreen" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" allowfullscreen msallowfullscreen width="100%" height="100%">
	</iframe>
	</div>
	</div>
	<script src="https://fast.wistia.net/assets/external/E-v1.js" async></script>`
}

function YoutubeModal ({id, type}){

	if(type === 'wistia')
		return (
			<div className={cn(styles.modal, styles.youtube)} >
				<div dangerouslySetInnerHTML={{__html: getHtml(id)}}></div>
			</div>
		)

	return (
		<div className={cn(styles.modal, styles.youtube)}>
			<iframe 
				width="100%" 
				height="100%" 
				src={`https://www.youtube.com/embed/${id}?autoplay=1&controls=1&rel=0&showinfo=0&modestbranding=1`}
				frameBorder="0" 
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
				allowFullScreen={true}
			></iframe>
		</div>
	)
}

export function openYoutubeModal (id, time, type){
	if(time && Date.now() < time) return

	modal.open(<YoutubeModal id={id} type={type}/>)
}