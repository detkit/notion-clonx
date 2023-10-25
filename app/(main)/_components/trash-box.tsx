'use client';

import { useMutation, useQuery } from 'convex/react';
import { Search, Trash, Undo } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { ConfirmMd } from '@/components/modals/CofirmMd';
import { Spinner } from '@/components/spinner';
import { Input } from '@/components/ui/input';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export default function TrashBox() {
	const router = useRouter();
	const params = useParams();
	const documents = useQuery(api.documents.getTrash);
	const restore = useMutation(api.documents.restore);
	const remove = useMutation(api.documents.remove);
	const [search, setSearch] = useState('');

	const filteredDocument = documents?.filter((document) => {
		return document.title.toLowerCase().includes(search.toLowerCase());
	});

	const onClick = (documentId: string) => {
		router.push(`/documents/${documentId}`);
	};

	const onRestore = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		documentId: Id<'document'>
	) => {
		e.stopPropagation();
		const promise = restore({ id: documentId });

		toast.promise(promise, {
			loading: 'Resoring note...',
			success: 'Note restored!',
			error: 'Failed to restore note.',
		});
	};

	const onRemove = (documentId: Id<'document'>) => {
		const promise = remove({ id: documentId });

		toast.promise(promise, {
			loading: 'Deleting note...',
			success: 'Note deleted',
			error: 'Failed to delete note.',
		});

		if (params.documentId === documentId) {
			router.push('/documents');
		}
	};

	if (documents === undefined) {
		return (
			<div className='flex items-center justify-center h-full p-4'>
				<Spinner size='lg' />
			</div>
		);
	}

	return (
		<div className='text-sm'>
			<div className='flex items-center p-2 gap-x-1'>
				<Search className='w-4 h-4' />
				<Input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder='Filter by page title...'
					className='px-2 h-7 focus-visible:ring-transparent bg-secondary'
				/>
			</div>
			<div className='px-1 pb-1 mt-2'>
				<p className='hidden pb-2 text-xs text-center last:block text-muted-foreground'>
					No documents found
				</p>
				{filteredDocument?.map((document) => (
					<div
						key={document._id}
						role='button'
						onClick={() => onClick(document._id)}
						className='flex items-center justify-between w-full text-sm rounded-sm hover:bg-primary/5 text-primary'
					>
						<span className='pl-2 truncate'>{document.title}</span>
						<div className='flex items-center'>
							<div
								onClick={(e) => onRestore(e, document._id)}
								role='button'
								className='p-2 rounded-sm hover:bg-neutral-200 dark:hover:bg-neutral-600'
							>
								<Undo className='w-4 h-4 text-muted-foreground' />
							</div>
							<ConfirmMd onConfirm={() => onRemove(document._id)}>
								<div
									role='button'
									className='p-2 rounde-sm hover:bg-neutral-200 dark:hover:bg-neutral-600'
								>
									<Trash className='w-4 h-4 text-muted-foreground' />
								</div>
							</ConfirmMd>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
