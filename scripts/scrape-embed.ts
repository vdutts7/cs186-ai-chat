import { Document } from 'langchain/document';
import * as fs from 'fs/promises';
import { CustomWebLoader } from '@/utils/custom_web_loader';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Embeddings, OpenAIEmbeddings } from 'langchain/embeddings';
import { SupabaseVectorStore } from 'langchain/vectorstores';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { supabaseClient } from '@/utils/supabase-client';
import { urls } from '@/config/class-website-urls';

async function extractDataFromUrl(url: string): Promise<Document[]> {
  try {
    const loader = new CustomWebLoader(url);
    const docs = await loader.load();
    return docs;
  } catch (error) {
    console.error(`FARTS! Issue while extracting data from ${url}: ${error}`);
    return [];
  }
}

async function extractDataFromUrls(urls: string[]): Promise<Document[]> {
  console.log('extracting text from the cs186 website...');
  const documents: Document[] = [];
  for (const url of urls) {
    const docs = await extractDataFromUrl(url);
    documents.push(...docs);
  }
  console.log('data extracted from the cs186 website');
  const json = JSON.stringify(documents);
  await fs.writeFile('cs186.json', json);
  console.log('json file containing text from the cs186 class website ~ saved on disk');
  return documents;
}

async function embedDocuments(
  client: SupabaseClient,
  docs: Document[],
  embeddings: Embeddings,
) {
  console.log('creating embeddings for the class website...');
  await SupabaseVectorStore.fromDocuments(client, docs, embeddings);
  console.log('the embeddings were successfully stored in Supabase');
}

async function splitDocsIntoChunks(docs: Document[]): Promise<Document[]> {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 200,
  });
  return await textSplitter.splitDocuments(docs);
}

(async function run(urls: string[]) {
  try {
    //load text from each url and chunk it up
    const rawDocs = await extractDataFromUrls(urls);
    const docs = await splitDocsIntoChunks(rawDocs);
    await embedDocuments(supabaseClient, docs, new OpenAIEmbeddings());   //embed into db --> supabase
  } catch (error) {
    console.log('Oopsie poopsie, something failed: ', error);
  }
})(urls);
