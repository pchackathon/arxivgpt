import { formatDate, idToURL } from "./formatter";

export const searchArxivPapers = async (keyword) => {
  try {
    const response = await fetch(
      `https://export.arxiv.org/api/query?search_query=${encodeURIComponent(
        keyword
      )}&max_results=10`
    );

    if (response.ok) {
      const data = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      const entries = xmlDoc.getElementsByTagName("entry");

      const papers = Array.from(entries).map((entry) => {
        const title = entry.getElementsByTagName("title")[0].textContent;
        const authors = Array.from(entry.getElementsByTagName("author")).map(
          (author) => author.textContent
        );
        const summary = entry.getElementsByTagName("summary")[0].textContent;
        const arxivId = entry.getElementsByTagName("id")[0].textContent;
        const dateStr = entry.getElementsByTagName("published")[0].textContent;
        const formattedDate = formatDate(dateStr);
        return { title, authors, summary, arxivId, date: formattedDate };
      });

      return papers;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const fetchBatchArxivMetadata = async (arxivIds) => {
  if (arxivIds) {
    // Transform arxivIds to handle both formats
    const transformedIds = arxivIds.map((id) => {
      if (id.includes(":")) {
        const [category, number] = id.split(":");
        return `${category}/${number}`;
      } else {
        return id;
      }
    });

    try {
      const url = `https://export.arxiv.org/api/query?id_list=${transformedIds.join(
        ","
      )}`;
      const response = await fetch(url);
      const xmlData = await response.text();

      const xml2js = require("xml2js");
      const parser = new xml2js.Parser();
      const jsonData = await parser.parseStringPromise(xmlData);

      const entries = jsonData.feed.entry;

      if (entries && entries.length > 0) {
        const metadata = entries.map((entry) => {
          const arxivId = entry.id[0];
          const title = entry.title[0];
          const authors = entry.author.map((author) => author.name);
          const summary = entry.summary[0];
          const dateStr = entry.published[0];
          const formattedDate = formatDate(dateStr);

          return {
            arxivId: idToURL(arxivId),
            title,
            authors,
            summary,
            date: formattedDate,
          };
        });

        return metadata;
      } else {
        console.log("No entries found in the XML response.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching ArXiv metadata:", error);
      return [];
    }
  }
};

export const fetchArXivMetadata = async (arxivId) => {
  try {
    let queryId = arxivId;

    if (arxivId.includes(":")) {
      const [category, id] = arxivId.split(":");
      queryId = `${category}/${id}`;
    }

    const response = await fetch(
      `https://export.arxiv.org/api/query?id_list=${queryId}`
    );
    const xmlData = await response.text();

    const xml2js = require("xml2js");
    const parser = new xml2js.Parser();
    const jsonData = await parser.parseStringPromise(xmlData);

    const entry = jsonData.feed.entry[0];
    const title = entry.title[0];
    const authors = entry.author.map((author) => author.name);
    const abstract = entry.summary;

    return {
      title: title,
      authors: authors,
      abstract: abstract,
    };
  } catch (error) {
    console.error("Error retrieving ArXiv metadata:", error);
  }
};
