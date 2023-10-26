'use client';

import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';

const DocumentsPage = () => {
	const { user } = useUser();
	const create = useMutation(api.documents.create);
	const router = useRouter();

	const onCreate = () => {
		const promise = create({ title: 'Untitled' }).then((documentId) =>
			router.push(`/documents/${documentId}`)
		);

		toast.promise(promise, {
			loading: 'Creating a new note...',
			success: 'New note a created',
			error: 'Failed to create new note',
		});
	};

	return (
		<div className='flex flex-col items-center justify-center h-full space-y-4'>
			<Image
				src='/empty.png'
				width='300'
				height='300'
				alt='Empty'
				className='dark:hidden'
			/>
			<Image
				src='/empty-dark.png'
				width='300'
				height='300'
				alt='Empty'
				className='hidden dark:block'
			/>

			<h2 className='text-lg font-medium'>
				Welcome to {user?.firstName}&apos;s Jotino
			</h2>
			<Button onClick={onCreate}>
				<PlusCircle className='w-4 h-4 mr-2' />
				Create a note
			</Button>
		</div>
	);
};

export default DocumentsPage;
