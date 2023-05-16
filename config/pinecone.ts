if (!process.env.PINECONE_INDEX_NAME) {
  throw new Error('.env file is missing a variable: PINECONE_INDEX_NAME');
}
console.log(process.env.PINECONE_INDEX_NAME)

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? '';
const PINECONE_NAME_SPACE = 'demo11-ramakrishnan';

export { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE };