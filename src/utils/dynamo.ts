import { fetchArXivMetadata } from "./arxiv";

const createNewArchive = async (id) => {
  try {
    const { title, abstract } = await fetchArXivMetadata(id);
    const res1 = await fetch("/api/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, abstract }),
    });

    const summary = await res1.json();

    if (summary.result) {
      const res2 = await fetch("/api/archives/new", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, summary: summary.result.trim() }),
      });

      if (res2.ok) {
        return summary.result.trim();
      } else {
        console.error("Failed to save new archive:", res2.status);
        return null;
      }
    }
  } catch (error) {
    console.error("Error adding new archive:", error);
    return null;
  }
};

const saveUpdatedArchive = async (archive) => {
  try {
    const updatedArchive = {
      ...archive,
      lastUpdated: Date.now().toString(),
    };

    const response = await fetch("/api/archives/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedArchive),
    });

    if (response.ok) {
      const updatedData = await response.json();
      return updatedData;
    } else {
      console.error("Failed to update archive:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error updating archive:", error);
    return null;
  }
};

const getArchive = async (id) => {
  try {
    const response = await fetch(
      `/api/archives/retrieve?id=${encodeURIComponent(id)}`
    );

    if (response.ok) {
      const archive = await response.json();
      return archive;
    } else {
      console.error("Failed to retrieve archive:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error retrieving archive:", error);
    return null;
  }
};

export { createNewArchive, saveUpdatedArchive, getArchive };
