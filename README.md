<!-- PROJECT LOGO -->
<br />
<div align="center">
    <img src="https://github.com/vdutts7/cs186-ai-chat/blob/main/public/cs186.png" alt="Logo" width="80" height="80">
    <img src="https://github.com/vdutts7/cs186-ai-chat/blob/main/public/UC-Berkeley-Emblem.png" alt="Logo" width="140" height="80">
    <img src="https://github.com/vdutts7/cs186-ai-chat/blob/main/public/robot.png" alt="Logo" width="80" height="80">
  </a>
  <h3 align="center">CS186 AI Chat</h3>
  <p align="center">
    CS186 AI Chatbot ~ trained on <a href="https://cs186berkeley.net/">official course website</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
## 📖 Table of Contents
  <ol>
    <li><a href="#about">About</a></li>
    <li><a href="#how-to-build">How to Build</a></li>
        <ul>
             <li>Initial setup</li>
             <li>Prepare Supabase environment</li>
             <li>Embedding & upserting data into Supabase vectorstore</li>
             <li>Behind-the-scenes: script explained</li>
             <li>Run the app</li>
             <li>Customizations</li>
        </ul>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>



<!-- ABOUT -->
## 📝 About

More natural way to help students study for exams, review weekly content, and customize learnings to recreate similar problems etc to their prefernce. Trained on the weekly Notes. CS186 students, staff, and more generally anyone can clone and use this repo and adjust to their liking.

_UC Berkeley 🐻🔵🟡 • CS186: Introduction to Database Systems • Spring 2023_ 

<p align="right">(<a href="#readme-top">back to top</a>)</p> 

## 💻 How to Build 

_Note: macOS version, adjust accordingly for Windows / Linux_

### Initial setup

Clone this repo & install packages using pnpm

```
git clone https://github.com/vdutts7/cs186-ai-chat
cd cs186-ai-chat
pnpm install
```

Copy `.env.local.example` into `.env` which should look like this (order doesn't matter):

```
OPENAI_API_KEY=""

NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
```

Check out [OpenAI](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key) on how to get an API key

Check out [Supabase](https://supabase.com/) on how to create a new project, database, and get keys from settings all found in [docs instructions](https://supabase.com/docs)

_**IMPORTANT: Verify that `.gitignore` contains `.env` in it.**_


### Prepare Supabase environment

I used Supabase as my vectorstore. Alternatives include: Pinecone, Qdrant, Redis, Weaviate, Chroma, Nuclei, Milvus, FAISS, HNSWLib and many more you can research about. Most are free or open-source. 

Copy paste contents of `schema.sql` in SQL editor of Supabase. Ensure the `documents` table in Supabase's database that is created matches and corresponds with local file's `match_documents` function.


### Embedding & upserting data into Supabase vectorstore

Inside the `config` folder is the `transcripts` folder with all lectures as .txt files and the corresponding JSON files for the metadatas. .txt files were scraped from the lecture recordings separately ahead of time but OpenAI's Whisper is a great package for Speech-to-Text transcription). Change according to preferences. `pageContent` and `metadata` are by default stored in Supabase along with an int8 type for the 'id' column.

Manually run the `embed-scripts.ipynb` notebook in the `scripts` folder OR run the package script from terminal:

```
npm run embed
```

This is a one-time process and depending on size of data you wish to upsert, it can take a few minutes. Check Supabase database to see updates reflected in the rows of your table there.


### Behind-the-scenes: script explained

This code performs the following:

- Installs the `supabase` Python library using `pip`. This allows interaction with a Supabase database.
- Loads various libraries:

    `supabase` - For interacting with Supabase
    
    `langchain` - For text processing and vectorization

    `json` - For loading JSON metadata files

- Loads the Supabase URL and API key from `.env`. This is used to create a `supabase_client` to connect to the Supabase database.
- Loads text data from .txt lecture transcripts and JSON metadata files.
- Uses a `RecursiveCharacterTextSplitter` to split the lecture text into chunks. This allows breaking the text into manageable pieces for processing. Chunk size and chunk overlap can be changed according to preference and basically control the amount of specificity. A larger chunk size and smaller overlap will result in fewer, broader chunks, while a smaller chunk size and larger overlap will produce more, narrower chunks.
- Creates OpenAI `text-embedding-ada-002` embeddings. This makes several vectors of 1536 dimensionality optimized for cosine similarity searches. These vectors are then combined with the metadata in the JSON files along with other lecture-specific info and upserted to the database as vector embeddings in row tabular format i.e. a `SupabaseVectorStore`.


### Run the app

Run app and verify everything went smoothly:

```
npm run dev
```

Should be able to type and ask questions now as you will any other chatbot.


### Customizations

Change UI to your liking. 
Edit prompt template in `utils/makechain.ts` to fine-tune and add greater control on bot's outputs.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- BUILT WITH -->
## 🔧 Built With
* [![Next][Next]][Next-url]
* [![Typescript][Typescript]][Typescript-url]
* [![Langchain][Langchain]][Langchain-url]
* [![OpenAI][OpenAI]][OpenAI-url]
* [![Supabase][Supabase]][Supabase-url]
* [![Tailwind CSS][TailwindCSS]][TailwindCSS-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## 👤 Contact

`me@vdutts7.com` 

🔗 Project Link: https://github.com/vdutts7/cs186-ai-chat

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->


[Next]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/

[Langchain]: https://img.shields.io/badge/🦜🔗Langchain-DD0031?style=for-the-badge&color=<brightgreen>
[Langchain-url]: https://langchain.com/

[TailwindCSS]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=skyblue&color=0A192F
[TailwindCSS-url]: https://tailwindcss.com/

[OpenAI]: https://img.shields.io/badge/OpenAI%20ada--002%20GPT--3-0058A0?style=for-the-badge&logo=openai&logoColor=white&color=black
[OpenAI-url]: https://openai.com/

[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://www.typescriptlang.org/

[Supabase]: https://img.shields.io/badge/Supabase%20pgvector-FFCA28?style=for-the-badge&logo=Supabase&logoColor=49E879&color=black
[Supabase-url]: https://Supabase.com/

