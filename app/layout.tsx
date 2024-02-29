import { Toaster } from '@/components/ui/sonner';
import { GeistSans } from 'geist/font/sans';
import './globals.css';

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: 'http://localhost:3000';

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: 'Intervaloo',
	description: 'The fastest way to get your intervals',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' className={GeistSans.className}>
			<body className='bg-background text-foreground min-h-screen flex flex-col items-center'>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
