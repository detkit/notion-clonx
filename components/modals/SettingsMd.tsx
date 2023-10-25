'use client';

import { ModeTheme } from '@/components/mode-theme';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/hooks/use-settings';

export const SettingsMd = () => {
	const settings = useSettings();

	return (
		<Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
			<DialogContent>
				<DialogHeader className='border-b pb-3'>
					<h2 className='text-lg font-medium'>My Settings</h2>
				</DialogHeader>
				<div className='flex items-center justify-between'>
					<div className='flex flex-col gap-y-1'>
						<Label>Apperance</Label>
						<span className='text-[0.8rem] text-muted-foreground'>
							Customize how Jotino looks your device
						</span>
					</div>
					<ModeTheme />
				</div>
			</DialogContent>
		</Dialog>
	);
};
