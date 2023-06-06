import { OpenAI } from 'langchain/llms';
import { LLMChain, ChatVectorDBQAChain, loadQAChain } from 'langchain/chains';
import { HNSWLib, SupabaseVectorStore } from 'langchain/vectorstores';
import { PromptTemplate } from 'langchain/prompts';

const PROMPT_INITIAL =
  PromptTemplate.fromTemplate(
    `Given the upcoming back-and-forth conversation which you will have with the User AND a Follow-Up Question, rephrase {question} to be a Standalone Question such that this Standalone Question will function to pass along {chat_history} memory of the current query and append it to a series of cumulative memories {chat_history}. This effectively is your long-term memory {chat_history} thta you add to in a cumulative fashion after each question {question}. As a result, you will be effectively dialoguing with User while doing your job as an assistant.
    
    Chat History: {chat_history}
    
    Follow-Up Question: {question}
    
    Standalone Question: `
  );

const PROMPT_RE = 
  PromptTemplate.fromTemplate(
    `You are an astute and quick-thinking information assistant as well as an expert on the UC Berkeley upper-division E.E.C.S department (College of Engineering) course, CS186 Introduction to Database Systems. You are given the following extracted parts of a long document and a {question}. Provide a conversational answer based on the {context} provided.
    You should only use hyperlinks as references that are explicitly listed as a source in the {context} below. Do NOT make up a hyperlink that is not listed below.
    If you cannot find the answer within the {context} below, state honestly "Hmm, I am unsure." Do NOT try to make up an answer.
    IF the question is unrelated to (1) CS186, (2) databases, or (3) anything else contextually relevant based on {context} provided, THEN politely inform them that you are tuned to only answer about CS186 and databases.
    Choose the most relevant link that matches the {context} provided:
    
    Question: {question}
    =========
    {context}
    =========
    Answer in Markdown: `
    );

export const makeChain = (
  vectorstore: SupabaseVectorStore,
  onTokenStream?: (token: string) => void,
) => {
  const questionGenerator = new LLMChain({
    llm: new OpenAI({ temperature: 0.5 }), //could change temp
    prompt: PROMPT_INITIAL,
  });
  const docChain = loadQAChain(
    new OpenAI({
      temperature: 0.5,
      streaming: Boolean(onTokenStream),
      callbackManager: {
        handleNewToken: onTokenStream,
      },
    }),
    { prompt: PROMPT_RE },
  );

  return new ChatVectorDBQAChain({
    vectorstore,
    combineDocumentsChain: docChain,
    questionGeneratorChain: questionGenerator,
  });
};
