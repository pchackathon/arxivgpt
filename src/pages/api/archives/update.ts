import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export default async function handler(req, res) {
  const { id, lastUpdated, messageHistory } = req.body;

  try {
    const updateExpression = `
      SET #lastUpdated = :lastUpdated,
      #messageHistory = :messageHistory
    `;

    const expressionAttributeNames = {
      "#lastUpdated": "lastUpdated",
      "#messageHistory": "messageHistory",
    };

    const expressionAttributeValues = {
      ":lastUpdated": { N: lastUpdated },
      ":messageHistory": {
        L: messageHistory.map((message) => ({
          M: {
            question: { S: message.question },
            answer: { S: message.answer },
          },
        })),
      },
    };

    await client.send(
      new UpdateItemCommand({
        TableName: process.env.ARCHIVE_TABLE,
        Key: { id: { S: id } },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating item:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
