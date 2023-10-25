'use client';

import { useQuery } from 'convex/react';
import { MenuIcon } from 'lucide-react';
import { useParams } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

import Banner from './banner';
import Title from './title';

interface NavbarProps {
	isCollapsed: boolean;
	onResetSide: () => void;
}

export default function Navbar({ isCollapsed, onResetSide }: NavbarProps) {
	const params = useParams();
	const document = useQuery(api.documents.getById, {
		documentId: params.documentId as Id<'document'>,
	});

	if (document === undefined) {
		return (
			<nav className='bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center'>
				<Title.Skeleton />
			</nav>
		);
	}

	if (document === null) {
		return null;
	}

	return (
		<>
			<nav className='bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center gap-x-4'>
				{isCollapsed && (
					<MenuIcon
						role='button'
						onClick={onResetSide}
						className='w-6 h-6 text-muted-foreground'
					/>
				)}
				<div className='flex items-center justify-between w-full'>
					<Title initialData={document} />
				</div>
			</nav>

			{document.isArchived && <Banner documentId={document._id} />}
		</>
	);
}
