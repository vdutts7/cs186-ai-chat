import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/utils/pinecone-client';
import { CustomPDFLoader } from '@/utils/customPDFLoader';
import { PINECONE_INDEX_NAME, PINECONE_NAMESPACE } from '@/config/pinecone';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';

const textbookPath = 'files';

export const run = async () => {
  try {
    const pathLoader = new DirectoryLoader(textbookPath, {'.pdf': (path) => new CustomPDFLoader(path),});
    const textSplitter =new RecursiveCharacterTextSplitter( {
      chunkSize: 10000,
      chunkOverlap: 800,
    });
    const textbook = await pathLoader.load();
    const splitTextbook = await textSplitter.splitDocuments(textbook);
    const ada_embeddings = new OpenAIEmbeddings();
    await PineconeStore.fromDocuments(splitTextbook, ada_embeddings, {
        namespace: PINECONE_NAMESPACE,
        pineconeIndex: pinecone.Index(PINECONE_INDEX_NAME),
        textKey: 'text',
    });

  } catch (error) {
    console.log('error', error);
    throw new Error('Oopsie poopsie--data could NOT be stored. Please investigate and fix to continue');
  }
};

(async () => {
  await run();
  console.log('Success! Data scraped + processed!');
})
();