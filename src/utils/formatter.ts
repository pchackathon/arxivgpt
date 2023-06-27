export const idToPDF = (id) => {
  let arxivId = id;
  if (id.includes(":")) {
    const [category, number] = id.split(":");
    arxivId = `${category}/${number}`;
  }

  const url = `https://arxiv.org/pdf/${arxivId}.pdf`;
  return url;
};

export const idToURL = (id) => {
  let arxivId = id;
  if (id.includes(":")) {
    const [category, number] = id.split(":");
    arxivId = `${category}/${number}`;
  }

  const url = `https://arxiv.org/abs/${arxivId}`;
  return url;
};

export const urlToID = (url) => {
  const trimmedURL = url.replace(/^(https?:\/\/)?(www\.)?/, "");

  const regex = /\/(\d+\.\d+)/;
  const matches = trimmedURL.match(regex);

  if (matches && matches.length > 1) {
    return matches[1];
  }

  return null;
};

export const urlToIDNew = (url) => {
  const trimmedURL = url.replace(/^(https?:\/\/)?(www\.)?/, "");

  const regex = /\/(\d+\.\d+)/;
  const matches = trimmedURL.match(regex);

  if (matches && matches.length > 1) {
    return matches[1];
  }

  return null;
};

export const getArXivIdentifier = (link) => {
  const pattern1 = /arxiv\.org\/abs\/(\d+\.\d+)/;
  const pattern2 = /arxiv\.org\/abs\/([^/]+)\/(\d+)/;

  const match1 = link.match(pattern1);
  const match2 = link.match(pattern2);

  if (match1) {
    return match1[1];
  } else if (match2) {
    const category = match2[1];
    const number = match2[2];
    return `${category}:${number}`;
  } else {
    return null;
  }
};

export const isValidArXivId = (input) => {
  const arxivIdRegex = /^(\d{4}\.\d{4,5}(v\d+)?|[^:]+:\d{6,8})$/;
  return arxivIdRegex.test(input);
};

export const isValidURL = (url) => {
  const id = getArXivIdentifier(url);
  if (id) {
    return true;
  } else {
    return false;
  }
};

export const formatDate = (dateStr) => {
  const options = { day: "numeric", month: "long", year: "numeric" };
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", options as any);
};
