export async function saveDataToLocalStorage(key, data) {
  try {
    if (!key || !data) {
      throw new Error("No key or data provided");
    }

    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(error);
  }
}

export async function getDataFromLocalStorage(key) {
  try {
    if (!key) {
      throw new Error("No key provided");
    }
    const data = localStorage.getItem(key);
    if (!data) {
      throw new Error("No data found for the provided key");
    }
    if (JSON.parse(data).length === 0) {
      throw new Error("The data array is empty");
    }
    return JSON.parse(data);
  } catch (error) {
    console.error(error.message);
  }
}
