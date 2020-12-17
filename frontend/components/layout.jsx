import Head from 'next/head'
import { ModalWrapper } from 'components/modal-window'

export default function Layout ({children}){

	return (
		<ModalWrapper>
			<Head>
				<title>Энергия талантов ПермНИПИнефть</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{children}
		</ModalWrapper>
	)
}
