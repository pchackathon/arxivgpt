import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export default async function handler(req, res) {
  const currentTime = new Date().getTime();

  const Item = {
    id: { S: req.body.id },
    creationTime: { N: currentTime.toString() },
    lastUpdated: { N: currentTime.toString() },
    messageHistory: { L: [] },
    summary: { S: req.body.summary },
  };

  await client.send(
    new PutItemCommand({
      TableName: process.env.ARCHIVE_TABLE,
      Item,
    })
  );

  return res.status(201).json(Item);
}
