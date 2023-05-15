import { PineconeClient } from '@pinecone-database/pinecone';

if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY) {
  throw new Error(
    '.env file missing one or more variables: PINECONE_ENVIRONMENT, PINECONE_API_KEY'
  );
}

async function initPinecone() {
  try {
    const pinecone = new PineconeClient();
    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT ?? '',
      apiKey: process.env.PINECONE_API_KEY ?? '',
    });
    return pinecone;
  } catch (error) {
    console.log('error', error);
    throw new Error(
      'Oopsie poopsie--Pinecone Client could NOT be initialized'
    );
  }
}

export async function getPinecone() {
  const pinecone = await initPinecone();
  return pinecone;
}