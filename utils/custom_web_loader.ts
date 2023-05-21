import type { CheerioAPI, load as LoadT } from 'cheerio';
import { Document } from 'langchain/document';
import { BaseDocumentLoader } from 'langchain/document_loaders';
import type { DocumentLoader } from 'langchain/document_loaders';
import { CheerioWebBaseLoader } from 'langchain/document_loaders';

export class CustomWebLoader
  extends BaseDocumentLoader
  implements DocumentLoader
{
  constructor(public webPath: string) {
    super();
  }

  static async _scrape(url: string): Promise<CheerioAPI> {
    const { load } = await CustomWebLoader.imports();
    const response = await fetch(url);
    const html = await response.text();
    return load(html);
  }

  async scrape(): Promise<CheerioAPI> {
    return CustomWebLoader._scrape(this.webPath);
  }

  async load(): Promise<Document[]> {
    const $ = await this.scrape();
    
    const headings = $('h1')
      .map((i, el) => $(el).text()) 
      .get();
  
    const paragraphs = $('p')  
      .map((i, el) => $(el).text())    
      .get();
  
    const metadata = {
      source: this.webPath  
    };
  
    return headings.map((heading, i) => {
      return new Document({  
        pageContent: heading + ' ' + paragraphs[i],
        metadata
      }); 
    });
  }

  static async imports(): Promise<{
    load: typeof LoadT;
  }> {
    try {
      const { load } = await import('cheerio');
      return { load };
    } catch (e) {
      console.error(e);
      throw new Error(
        'Possibly error with cheerio. Install dependency `yarn add cheerio`',
      );
    }
  }
}
