'use client';

import { useConvexAuth } from 'convex/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { SignInButton } from '@clerk/clerk-react';

const Heading = () => {
	const { isAuthenticated, isLoading } = useConvexAuth();

	return (
		<div className='max-w-3xl space-y-4'>
			<h1 className='text-3xl font-bold sm:text-5xl md:text-6xl'>
				Your Ideas, Documents, & Plans, Unified. Welcome to{' '}
				<span className='underline'>Jotino</span>
			</h1>
			<h3 className='text-base font-medium sm:text-xl md:text-3xl'>
				Jotion is the connected workspace where
				<br /> better, faster work happens.
			</h3>
			{isLoading && (
				<div className='flex items-center justify-center w-full'>
					<Spinner size='lg' />
				</div>
			)}
			{isAuthenticated && !isLoading && (
				<Button asChild>
					<Link href='/documents'>
						Enter Jotino
						<ArrowRight className='w-4 h-4 ml-2' />
					</Link>
				</Button>
			)}
			{!isAuthenticated && !isLoading && (
				<SignInButton mode='modal'>
					<Button>
						Get Jotino free
						<ArrowRight className='w-4 h-4 ml-2' />
					</Button>
				</SignInButton>
			)}
		</div>
	);
};

export default Heading;
