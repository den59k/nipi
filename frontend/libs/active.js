import { useEffect, useState } from 'react'

export function useActive (time) {

	const [ active, setActive ] = useState(false)

	

	useEffect(() => {
		
		if(!time) return
		if(Date.now() > time){ setActive(true); return; }
		
		const interval = setInterval(() => {
			if(Date.now() > time)
				setActive(true)
			else
				setActive(false)
		}, 2000)

		return () => clearInterval(interval)

	}, [time])

	return active
}