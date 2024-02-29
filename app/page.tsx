'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatRange, getRanges } from '@/utils/ranges';
import { CopyIcon } from '@radix-ui/react-icons';
import { useChat } from 'ai/react';
import { Loader } from 'lucide-react';
import { useState } from 'react';
import useClipboard from 'react-use-clipboard';
import { toast } from 'sonner';

function IntervalDisplay({ pgRange }: { pgRange: string }) {
	const [startDate, endDate] = formatRange(pgRange);
	const [isCopied, setCopied] = useClipboard(pgRange, {
		successDuration: 2000,
	});

	const formatter = Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		minute: '2-digit',
		hour: '2-digit',
	});

	const intervalText = `${formatter.format(startDate)} - ${formatter.format(
		endDate
	)}`;

	const handleClick = () => {
		setCopied();
		toast(`Interval ${intervalText} copied to clipboard 🚀`);
	};

	return (
		<li className='flex items-center justify-between p-4'>
			<span>{intervalText}</span>
			<Button
				size='sm'
				variant='outline'
				onClick={handleClick}
				className='hover:text-lime-400 disabled:hover:cursor-not-allowed disabled:opacity-50'
				disabled={isCopied}
			>
				<CopyIcon />
			</Button>
		</li>
	);
}

export default function Index() {
	const [intervals, setIntervals] = useState<string[]>([]);

	const { input, handleInputChange, handleSubmit, isLoading } = useChat({
		body: {
			date: new Date().toString(),
		},
		async onResponse(response) {
			try {
				const result = await response.text();

				setIntervals((prev) => [...prev, ...getRanges(result)]);
			} catch (error) {
				console.error(error);
			}
		},
	});

	return (
		<div
			key='1'
			className='flex flex-col md:flex-row w-full h-full gap-4 md:gap-8 p-4 md:p-6 py-12 min-h-screen container mx-auto'
		>
			<div className='flex-1 md:flex-initial md:w-1/2'>
				<form onSubmit={handleSubmit} className='grid gap-4'>
					<h2 className='text-2xl font-bold'>Textarea</h2>
					<Textarea
						value={input}
						onChange={handleInputChange}
						className='min-h-[50vh] md:h-auto resize-none'
						placeholder='Type here...'
					/>
					<Button type='submit'>Submit</Button>
				</form>
			</div>
			<div className='flex-1 md:flex-initial md:w-1/2 h-full'>
				<div className='grid gap-4 h-full'>
					<h2 className='text-2xl font-bold'>Datetime Intervals</h2>
					<div className='overflow-auto border rounded-lg h-full'>
						<ul className='divide-y h-full'>
							{intervals.length > 0
								? intervals.map((pgRange, i) => (
										<IntervalDisplay key={pgRange + i} pgRange={pgRange} />
								  ))
								: !isLoading && (
										<li className='p-4 text-center'>No intervals yet ⏰</li>
								  )}

							{isLoading && (
								<div className='flex items-center justify-center p-4'>
									<Loader className='w-6 h-6' />
								</div>
							)}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
