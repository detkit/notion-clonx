'use client';

import { useMutation } from 'convex/react';
import { ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useCoverImage } from '@/hooks/use-cover-image';
import { useEdgeStore } from '@/lib/edgestore';
import { cn } from '@/lib/utils';

interface CoverImageProps {
	url?: string;
	preview?: boolean;
}

export const Cover = ({ url, preview }: CoverImageProps) => {
	const { edgestore } = useEdgeStore();
	const params = useParams();
	const coverImage = useCoverImage();
	const removeCoverImage = useMutation(api.documents.removeCoverImage);

	const onRemove = async () => {
		if (url) {
			await edgestore.publicFiles.delete({
				url: url,
			});
		}
		removeCoverImage({
			id: params.documentId as Id<'document'>,
		});
	};

	return (
		<div
			className={cn(
				'relative w-full h-[35vh] group',
				!url && 'h-[12vh]',
				url && 'bg-muted'
			)}
		>
			{!!url && (
				<Image src={url} fill alt='Cover' className='object-cover' />
			)}
			{url && !preview && (
				<div className='absolute flex items-center opacity-0 group-hover:opacity-100 bottom-5 right-5 gap-x-2'>
					<Button
						onClick={() => coverImage.onReplace(url)}
						className='text-xs text-muted-foreground'
						variant='outline'
						size='sm'
					>
						<ImageIcon className='w-4 h-4 mr-2' />
						Change cover
					</Button>
					<Button
						onClick={onRemove}
						className='text-xs text-muted-foreground'
						variant='outline'
						size='sm'
					>
						<X className='w-4 h-4 mr-2' />
						Remove
					</Button>
				</div>
			)}
		</div>
	);
};

Cover.Skeleton = function CoverSkeleton() {
	return <Skeleton className='w-full h-[12vh]' />;
};
