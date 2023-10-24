'use client';

import { SignInButton, UserButton } from '@clerk/clerk-react';
import { useConvexAuth } from 'convex/react';
import Link from 'next/link';

import { ModeTheme } from '@/components/mode-theme';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { ScrollTop } from '@/hooks/scroll-top';

import { cn } from '@/lib/utils';

import { Logo } from './logo';

export default function Navbar() {
	const { isAuthenticated, isLoading } = useConvexAuth();
	const scrolled = ScrollTop();

	return (
		<div
			className={cn(
				'z-50 bg-transparent dark:bg-[#1f1f1f] fixed top-0 flex items-center w-full p-6',
				scrolled && 'border-b shadow-sm'
			)}
		>
			<Logo />
			<div className='flex items-center justify-between w-full md:ml-auto md:justify-end gap-x-2'>
				{isLoading && <Spinner />}
				{!isAuthenticated && !isLoading && (
					<>
						<SignInButton mode='modal'>
							<Button variant='ghost' size='sm'>
								Log in
							</Button>
						</SignInButton>
						<SignInButton mode='modal'>
							<Button size='sm'>Get Jotino free</Button>
						</SignInButton>
					</>
				)}
				{isAuthenticated && !isLoading && (
					<>
						<Button variant='ghost' size='sm' asChild>
							<Link href='/documents'>Enter Jotino</Link>
						</Button>
						<UserButton afterSignOutUrl='/' />
					</>
				)}
				<ModeTheme />
			</div>
		</div>
	);
}
