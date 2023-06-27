// @ts-nocheck
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const response = await client.send(
      new GetItemCommand({
        TableName: process.env.ARCHIVE_TABLE,
        Key: { id: { S: id } },
      })
    );

    const item = response.Item;
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const archive = {
      id: item.id.S,
      creationTime: parseInt(item.creationTime.N),
      lastUpdated: parseInt(item.lastUpdated.N),
      messageHistory: item.messageHistory.L.map((message) => ({
        question: message.M.question.S,
        answer: message.M.answer.S,
      })),
      summary: item.summary.S,
    };

    return res.status(200).json(archive);
  } catch (error) {
    console.error("Error retrieving item:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
