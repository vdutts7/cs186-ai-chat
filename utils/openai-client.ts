import { OpenAI } from 'langchain/llms';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI Credentials');
}

export const openai = new OpenAI({
  temperature: 0.5,
});

export const openaiStream = new OpenAI({
  temperature: 0.5,
  streaming: true,
  callbackManager: {
    handleNewToken(token) {
      console.log(token);
    },
  },
});
