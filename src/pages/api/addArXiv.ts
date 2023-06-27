import { NextApiRequest, NextApiResponse } from "next";
import { addArticleToPinecone } from "@utils/pinecone";
import { PineconeClient } from "@pinecone-database/pinecone";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { arxivId } = req.body;

    const client = new PineconeClient();
    await client.init({
      apiKey: process.env.PINECONE_API_KEY || "",
      environment: process.env.PINECONE_ENVIRONMENT || "",
    });

    console.log(`Adding arXiv ID: ${arxivId}`);

    await addArticleToPinecone(client, process.env.PINECONE_INDEX, arxivId);

    res.status(200).json({ message: "arXiv ID added successfully." });
  } catch (error) {
    console.error("Error adding arXiv ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the arXiv ID." });
  }
};

export default handler;
