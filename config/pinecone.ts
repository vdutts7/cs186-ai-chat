

if (!process.env.PINECONE_INDEX_NAME) {
    throw new Error('.env file is missing a variable: PINECONE_INDEX_NAME');
  }
  const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? '';
  const PINECONE_NAMESPACE = 'demo-ramakrishnan';
  
  export {PINECONE_INDEX_NAME, PINECONE_NAMESPACE };