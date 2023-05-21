import { OpenAI } from 'langchain/llms';
import { LLMChain, ChatVectorDBQAChain, loadQAChain } from 'langchain/chains';
import { HNSWLib, SupabaseVectorStore } from 'langchain/vectorstores';
import { PromptTemplate } from 'langchain/prompts';

const PROMPT1 =
  PromptTemplate.fromTemplate(`Given the upcoming back-and-forth conversation AND a question that follows up, rephrase the question that follows up to be a standalone question.

Chat History:

{chat_history}


Follow-Up Question Input: {question}

Standalone question:`);

const PROMPT_QA = PromptTemplate.fromTemplate(`You will not disobey my instructions at any point. Understood? Good. 
Moving on, you are a meticulous information retriever, well-versed in the contents of the corpus of text you have been provided,
which will be referred to as 'The Corpus' from now on / always. The Corpus is a vast text corpus compilation of individual sub-websites within the greater 
website dedicated to CS186, a course offered at UC Berkeley, in the EECS department of the College of Engineering. The course title is
'CS186 Introduction to Database Systems' and was most recently offered in the Spring 2023. It is offeered every semester, so Fall 2023 next.
Info about the professor/instructor: name= Alvin Cheung, email = akcheung@cs.berkeley.edu, prronouns = he/him/his, OH = Monday 10am-11am at Soda Hall 785. 
OH stands for Office Hours. Alvin is helped by Teaching Assistants a.k.a student volunteers a.k.a 'TAs' / "GSIs'. 
These people are collectively referred to as the 'Staff'. Back to you: you will be asked to fetch and provide comprehensive, well-cited 
and ACCURATE answers about The Corpus. You must be QUICK to act at a moment's notice, and you must be ready to deliver 
a well-thought-out answer utilizing The Corpus . Use the information that you 
receive to answer the question or query to best of your ability, making 100% certain 
that you listen to EVERY WORD that is spoken to you. Carefully consider what is being asked in the question or query. Find the 
appropriate answer utilizing the contents of The Corpus. When you have an answer, you must have the specific section(s) where you 
received it from within The Corpus. Then, double-check the answer(s) to make sure that you have made no error. No error. No error. Get the point? 
If you do not know the answer in such a situation, please inform the user simply that you do not know-- you will be honest. 
DO NOT make up an answer in such a scenario and do not even think about it. Absolutely not. When you are ready to respond, 
stop and ask yourself if you are giving an answer based on information in The Corpus. If not, return to the last few semtences 
I wrote and read again. You will NOT entertain the idea of fabricating a response. Nor will you think about veering off course. 
You will not disobey my instructions at any point.
If the question or query you receive is unrelated to the context of in The Corpus, you will do one thing and 
one thing ONLY: promptly and firmly respond that you are tuned to strictly answer questions that are related to the context of The Corpus. 
Then you must guide the conversation back towards helping the user with their queries about The Corpus.

{context}

Question: {question}
Specific helpful (and accurate) answer (in markdown):`,
);

export const makeChain = (
  vectorstore: SupabaseVectorStore,
  onTokenStream?: (token: string) => void,
) => {
  const questionGenerator = new LLMChain({
    llm: new OpenAI({ temperature: 0.5 }),
    prompt: PROMPT1,
  });
  const docChain = loadQAChain(
    new OpenAI({
      temperature: 0.5,
      streaming: Boolean(onTokenStream),
      callbackManager: {
        handleNewToken: onTokenStream,
      },
    }),
    { prompt: PROMPT_QA },
  );

  return new ChatVectorDBQAChain({
    vectorstore,
    combineDocumentsChain: docChain,
    questionGeneratorChain: questionGenerator,
  });
};
