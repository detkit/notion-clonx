'use client';

import { useConvexAuth } from 'convex/react';
import { redirect } from 'next/navigation';

import { SearchCommand } from '@/components/search-command';
import { Spinner } from '@/components/spinner';

import Navigation from './_components/navigation';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
	const { isAuthenticated, isLoading } = useConvexAuth();

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-full'>
				<Spinner size='lg' />
			</div>
		);
	}

	if (!isAuthenticated) {
		return redirect('/');
	}

	return (
		<div className='h-full flex dark:bg-[#1f1f1f]'>
			<Navigation />
			<main className='flex-1 h-full overflow-y-auto'>
				<SearchCommand />
				{children}
			</main>
		</div>
	);
};

export default MainLayout;
