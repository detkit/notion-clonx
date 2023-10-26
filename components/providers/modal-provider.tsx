'use client';

import { useEffect, useState } from 'react';

import { SettingsMd } from '@/components/modals/SettingsMd';
import { CoverImageModal } from '@/components/modals/cover-image-modal';

export const ModalProvider = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<>
			<SettingsMd />
			<CoverImageModal />
		</>
	);
};
