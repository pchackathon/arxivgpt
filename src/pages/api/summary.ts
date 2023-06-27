import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      return;
    }

    const { title, abstract } = req.body;

    const promptTemplate = `
    **ELI5 Summary of Arxiv Paper**

    Title: {title}

    Abstract: {abstract}

    Explain the above abstract in the simplest, and most easy to understand way possible. Provide a clear and comprehensible explanation, maintaining the key meaning and terminology of the text.

    ELI5 Summary:
    `;

    const model = new OpenAI({ temperature: 0.7 });
    const prompt = PromptTemplate.fromTemplate(promptTemplate);
    const chain = new LLMChain({ llm: model, prompt });

    const result = await chain.call({ title, abstract });
    console.log(result);

    res.status(200).json({ result: result.text });
  } catch (error) {
    console.error("Error generating summary:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating summary." });
  }
};

export default handler;
