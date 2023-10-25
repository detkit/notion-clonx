'use client';

import { useEffect, useState } from 'react';

import { SettingsMd } from '@/components/modals/SettingsMd';

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
		</>
	);
};
