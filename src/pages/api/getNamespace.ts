import { NextApiRequest, NextApiResponse } from "next";
import { retrieveNamespace } from "@utils/pinecone";
import { PineconeClient } from "@pinecone-database/pinecone";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = new PineconeClient();
    await client.init({
      apiKey: process.env.PINECONE_API_KEY || "",
      environment: process.env.PINECONE_ENVIRONMENT || "",
    });

    const namespaceQuery = req.query.namespace as string;

    const namespaceArray = await retrieveNamespace(
      client,
      process.env.PINECONE_INDEX
    );
    console.log({ namespaceArray });

    const isNamespacePresent = namespaceArray.includes(namespaceQuery);
    console.log({ isNamespacePresent });

    res.status(200).json({ isNamespacePresent });
  } catch (error) {
    console.error("Error retrieving namespace:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the namespace." });
  }
};

export default handler;
