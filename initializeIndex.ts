const { PineconeClient } = require("@pinecone-database/pinecone");
require("dotenv").config({ path: ".env.local" });

const createPineconeIndex = async (indexName, vectorDimension) => {
  const client = new PineconeClient();
  await client.init({
    apiKey: process.env.PINECONE_API_KEY || "",
    environment: process.env.PINECONE_ENVIRONMENT || "",
  });

  console.log(`Checking "${indexName}"...`);
  const existingIndexes = await client.listIndexes();

  if (!existingIndexes.includes(indexName)) {
    console.log(`Creating "${indexName}"...`);
    await client.createIndex({
      createRequest: {
        name: indexName,
        dimension: vectorDimension,
        metric: "cosine",
      },
    });

    console.log(
      `Creating index.... please wait for it to finish initializing.`
    );
    await new Promise((resolve) => setTimeout(resolve, 80000));

    console.log(`Successfully created index: ${indexName}`);
  } else {
    console.log(`"${indexName}" already exists.`);
  }
};

const indexName = process.env.PINECONE_INDEX;
const vectorDimensions = 1536;

createPineconeIndex(indexName, vectorDimensions);
