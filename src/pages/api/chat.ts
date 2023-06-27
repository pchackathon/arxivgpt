import { NextApiRequest, NextApiResponse } from "next";
import { queryPineconeVectorStoreAndQueryLLM } from "@utils/pinecone";
import { PineconeClient } from "@pinecone-database/pinecone";

import { CallbackManager } from "langchain/callbacks";
import { OpenAI } from "langchain/llms/openai";
import { Document } from "langchain/document";
import { loadQAStuffChain } from "langchain/chains";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { question, arxivId } = req.body;

      const client = new PineconeClient();
      await client.init({
        apiKey: process.env.PINECONE_API_KEY || "",
        environment: process.env.PINECONE_ENVIRONMENT || "",
      });

      console.log({ question, arxivId });

      const { queryResponse } = await queryPineconeVectorStoreAndQueryLLM(
        client,
        process.env.PINECONE_INDEX,
        question,
        arxivId
      );

      res.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Transfer-Encoding": "chunked",
      });

      console.log(`Asking question: ${question}...`);
      if (queryResponse.matches.length) {
        const llm = new OpenAI({
          streaming: true,
          callbackManager: CallbackManager.fromHandlers({
            async handleLLMNewToken(token) {
              res.write(`${token}`);
            },
          }),
        });

        const chain = loadQAStuffChain(llm);

        const concatenatedPageContent = queryResponse.matches
          .map((match) => match.metadata.pageContent)
          .join(" ");

        await chain.call({
          input_documents: [
            new Document({ pageContent: concatenatedPageContent }),
          ],
          question: question,
        });

        res.end();
      } else {
        console.log("Since there are no matches, GPT-3 will not be queried.");
      }
    } catch (error) {
      console.error("Error retrieving answer:", error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving querying the db." });
    }
  }
};

export default handler;
