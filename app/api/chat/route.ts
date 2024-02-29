import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextRequest } from 'next/server';
// import { createClient } from '@/utils/supabase/server';
// import { getRanges } from '@/utils/ranges';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: NextRequest) {
	const { messages, date } = await req.json();
	// const supabase = createClient();

	const lastMessage = messages[messages.length - 1];

	lastMessage.content = lastMessage.content + date;

	const response = await openai.chat.completions.create({
		model: process.env.OPENAI_MODEL_ID!!,
		messages: [
			{
				role: 'system',
				content:
					'you are an expert human-readable interval to postgresql tstzrange converter',
			},
			...messages,
		],
		temperature: 0,
		max_tokens: 4000,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
		stream: true,
	});

	const stream = OpenAIStream(response, {
		// async onCompletion(completion) {
		// 	const ranges = getRanges(completion);
		// 	const response = await supabase
		// 		.from('ranges')
		// 		.insert(ranges.map((range) => ({ range })));
		// },
	});

	return new StreamingTextResponse(stream);
}
