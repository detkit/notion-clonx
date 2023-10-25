'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ConfirmMdProps {
	children: React.ReactNode;
	onConfirm: () => void;
}

export const ConfirmMd = ({ children, onConfirm }: ConfirmMdProps) => {
	const handleConfirm = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.stopPropagation();
		onConfirm();
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger
				onClick={(e: any) => e.stopPropagation()}
				asChild
			>
				{children}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you absolutety sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel
						onClick={(e: any) => e.stopPropagation()}
					>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction onClick={handleConfirm}>
						Confirm
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
