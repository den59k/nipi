import { useEffect, useState } from 'react'


export function useResize (resizing){
	const [ value, setValue ] = useState(resizing[0])
	useEffect(() => {
		const resize = () => {

			for(let res of resizing){
				if(document.documentElement.clientWidth > res.min)
					return setValue(res.value)
			}
			return setValue(resizing[resizing.length-1].value)
		}

		resize()
		window.addEventListener('resize', resize)
		return () => window.removeEventListener('resize', resize)
	}, [])

	return value
}