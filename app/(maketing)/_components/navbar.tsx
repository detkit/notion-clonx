'use client';

import { ModeTheme } from '@/components/mode-theme';
import { ScrollTop } from '@/hooks/scroll-top';
import { cn } from '@/lib/utils';
import { Logo } from './logo';

export default function Navbar() {
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
				<ModeTheme />
			</div>
		</div>
	);
}
