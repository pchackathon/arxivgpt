// @ts-nocheck
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export default async function handler(req, res) {
  try {
    const scanCommand = new ScanCommand({
      TableName: process.env.ARCHIVE_TABLE,
      Limit: 5,
      ScanIndexForward: false,
    });
    const response = await client.send(scanCommand);

    const ids = response.Items.map((item) => item.id.S);

    res.status(200).json(ids);
  } catch (error) {
    console.error("Error retrieving recent records:", error);
    res.status(500).json({ error: "Failed to retrieve recent records" });
  }
}
