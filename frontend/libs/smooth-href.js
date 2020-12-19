const easeInOutCubic = t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1

const onClick = (e) => {
	e.preventDefault()
	
	const href = e.currentTarget.getAttribute('href')

	const target = document.getElementById(href.slice(2))
	if(!target) return
	
	const top = target.getBoundingClientRect().top + pageYOffset
	const startScroll = pageYOffset;

	let start = null
	const anim = (timestamp) => {
		if (!start) start = timestamp;
		let progress = (timestamp - start) / 700

		if(progress > 1) progress = 1
		
		window.scrollTo(0, startScroll + (top-startScroll)*easeInOutCubic(progress))
		if(progress < 1)
			requestAnimationFrame(anim)
		else
			window.location.hash = href.slice(1)
	}
	requestAnimationFrame(anim)
}

export default onClick