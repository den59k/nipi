import Head from 'next/head'

export default function Layout ({children}){

	return (
		<>
			<Head>
				<title>Энергия талантов ПермНИПИнефть</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{children}
		</>
	)
}
