import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { idToPDF } from "./formatter";

import PDFParser from "pdf-parse";

const convertPdfToText = async (pdfBuffer) => {
  try {
    const pdf = await PDFParser(pdfBuffer);
    return pdf.text;
  } catch (error) {
    console.error("Error converting PDF to text:", error);
    return "";
  }
};

export const queryPineconeVectorStoreAndQueryLLM = async (
  client,
  indexName,
  question,
  namespace
) => {
  console.log("Querying Pinecone vector store...");
  const index = client.Index(indexName);
  const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);

  let queryResponse = await index.query({
    queryRequest: {
      topK: 10,
      vector: queryEmbedding,
      includeMetadata: true,
      includeValues: true,
      namespace: namespace,
    },
  });

  console.log(`Found ${queryResponse.matches.length} matches...`);
  return { queryResponse };
};

export const retrieveNamespace = async (client, indexName) => {
  console.log("Retrieving Pinecone index...");
  const index = client.Index(indexName);

  const indexDescription = await index.describeIndexStats({
    describeIndexStatsRequest: {},
  });
  var result = Object.keys(indexDescription.namespaces).map((key) => key);

  return result;
};

export const addArticleToPinecone = async (client, indexName, arxivId) => {
  let namespace = arxivId;
  let url = idToPDF(arxivId);

  console.log("Retrieving Pinecone index...");
  const index = client.Index(indexName);

  console.log(`Pinecone index retrieved: ${indexName}`);
  console.log(`Processing document from URL: ${url}`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch the PDF document");
    }
    const arrayBuffer = await response.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    console.log("PDF document downloaded successfully");

    const text = await convertPdfToText(pdfBuffer);

    if (typeof text !== "string") {
      throw new Error("PDF to text conversion resulted in a non-string value");
    }

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    console.log("Splitting text into chunks...");

    const chunks = await textSplitter.createDocuments([text]);
    console.log(`Text split into ${chunks.length} chunks`);
    console.log(
      `Calling OpenAI's Embedding endpoint with ${chunks.length} text chunks ...`
    );

    const embeddingsArrays = await new OpenAIEmbeddings().embedDocuments(
      chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
    );
    console.log("Finished embedding documents");
    console.log(
      `Creating ${chunks.length} vectors array with id, values, and metadata...`
    );

    const batchSize = 100;
    let batch: any[] = [];

    for (let idx = 0; idx < chunks.length; idx++) {
      const chunk = chunks[idx];
      const vector = {
        id: `${url}_${idx}`,
        values: embeddingsArrays[idx],
        metadata: {
          ...chunk.metadata,
          loc: JSON.stringify(chunk.metadata.loc),
          pageContent: chunk.pageContent,
          pdfUrl: url,
        },
      };
      batch = [...batch, vector];

      if (batch.length === batchSize || idx === chunks.length - 1) {
        await index.upsert({
          upsertRequest: {
            vectors: batch,
            namespace: namespace,
          },
        });

        batch = [];
      }
    }

    console.log(`Pinecone index updated with ${chunks.length} vectors`);
  } catch (error) {
    console.error("Error updating Pinecone index:", error);
    throw error;
  }
};
