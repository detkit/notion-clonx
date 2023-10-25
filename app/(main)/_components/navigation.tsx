'use client';

import { useMutation } from 'convex/react';
import {
	ChevronsLeft,
	MenuIcon,
	Plus,
	PlusCircle,
	Search,
	Settings,
	Trash,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { ElementRef, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useMediaQuery } from 'usehooks-ts';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { api } from '@/convex/_generated/api';
import { useSearch } from '@/hooks/use-search';
import { useSettings } from '@/hooks/use-settings';
import { cn } from '@/lib/utils';

import { DocumentList } from './document-list';
import { Item } from './item';
import TrashBox from './trash-box';
import UserItem from './user-item';

export default function Navigation() {
	const search = useSearch();
	const settings = useSettings();
	const pathName = usePathname();
	const router = useRouter();
	const isMobile = useMediaQuery('(max-width: 768px)');
	const create = useMutation(api.documents.create);

	const isResizingRef = useRef(false);
	const sidebarRef = useRef<ElementRef<'aside'>>(null);
	const navbarRef = useRef<ElementRef<'div'>>(null);
	const [isResetting, setIsResetting] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(isMobile);

	useEffect(() => {
		if (isMobile) {
			collapse();
		} else {
			resetSide();
		}
	}, [isMobile]);

	useEffect(() => {
		if (isMobile) {
			collapse();
		}
	}, [pathName, isMobile]);

	const handleMouseDown = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		e.preventDefault();
		e.stopPropagation();

		isResizingRef.current = true;
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (!isResizingRef.current) return;
		let newWidth = event.clientX;

		if (newWidth < 240) newWidth = 240;
		if (newWidth > 480) newWidth = 480;

		if (sidebarRef.current && navbarRef.current) {
			sidebarRef.current.style.width = `${newWidth}px`;
			navbarRef.current.style.setProperty('left', `${newWidth}px`);
			navbarRef.current.style.setProperty(
				'width',
				`calc(100% - ${newWidth}px)`
			);
		}
	};

	const handleMouseUp = () => {
		isResizingRef.current = false;
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
	};

	const resetSide = () => {
		if (sidebarRef.current && navbarRef.current) {
			setIsCollapsed(false);
			setIsResetting(true);

			sidebarRef.current.style.width = isMobile ? '100px' : '240px';
			navbarRef.current.style.setProperty(
				'width',
				isMobile ? '0' : 'calc(100% - 240px)'
			);
			navbarRef.current.style.setProperty(
				'left',
				isMobile ? '100%' : '240px'
			);
			setTimeout(() => setIsResetting(false), 300);
		}
	};

	const collapse = () => {
		if (sidebarRef.current && navbarRef.current) {
			setIsCollapsed(true);
			setIsResetting(true);

			sidebarRef.current.style.width = '0';
			navbarRef.current.style.setProperty('width', '100%');
			navbarRef.current.style.setProperty('left', '0');
			setTimeout(() => setIsResetting(false), 300);
		}
	};

	const handleCreate = () => {
		const promise = create({ title: 'Untitled' }).then((documentId) =>
			router.push(`/documents/${documentId}`)
		);

		toast.promise(promise, {
			loading: 'Creating a new note...',
			success: 'New note created!',
			error: 'Failed to create a new note.',
		});
	};

	return (
		<>
			<aside
				ref={sidebarRef}
				className={cn(
					'group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]',
					isResetting && 'transition-all ease-in-out duration-300',
					isMobile && 'w-0'
				)}
			>
				<div
					onClick={collapse}
					role='button'
					className={cn(
						'absolute w-6 h-6 transition rounded-sm opacity-0 text-muted-foreground hover:bg-neutral-300 dark:hover:bg-neutral-600 top-3 right-2 group-hover/sidebar:opacity-100',
						isMobile && 'opacity-100'
					)}
				>
					<ChevronsLeft className='w-6 h-6' />
				</div>
				<div>
					<UserItem />
					<Item
						label='Search'
						icon={Search}
						isSearch
						onClick={search.onOpen}
					/>
					<Item
						label='Setting'
						icon={Settings}
						onClick={settings.onOpen}
					/>
					<Item
						onClick={handleCreate}
						label='New page'
						icon={PlusCircle}
					/>
				</div>
				<div className='mt-4'>
					<DocumentList />
					<Item
						onClick={handleCreate}
						icon={Plus}
						label='Add a page'
					/>
					<Popover>
						<PopoverTrigger className='w-full mt-4'>
							<Item label='Trash' icon={Trash} />
						</PopoverTrigger>
						<PopoverContent
							className='p-0 w-72'
							side={isMobile ? 'bottom' : 'right'}
						>
							<TrashBox />
						</PopoverContent>
					</Popover>
				</div>

				<div
					onMouseDown={handleMouseDown}
					onClick={resetSide}
					className='absolute top-0 right-0 w-1 h-full transition opacity-0 group-hover/sidebar:opacity-100 cursor-ew-resize bg-primary/10'
				/>
			</aside>

			<div
				ref={navbarRef}
				className={cn(
					'absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]',
					isResetting && 'transition-all ease-in-out duration-300',
					isMobile && 'left-0 w-full'
				)}
			>
				<nav className='w-full px-3 py-2 bg-transparent'>
					{isCollapsed && (
						<MenuIcon
							onClick={resetSide}
							role='button'
							className='w-6 h-6 text-muted-foreground'
						/>
					)}
				</nav>
			</div>
		</>
	);
}
