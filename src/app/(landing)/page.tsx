import HeaderWrapper from '@/components/landing/HeaderWrapper'
import LandingPage from '@/components/landing/LandingPage'
import React from 'react'

const landing = () => {
	return (
		<div>
			<HeaderWrapper />
			<main className="flex h-screen flex-col items-center ">
				<LandingPage />
			</main>
		</div>
	)
}

export default landing