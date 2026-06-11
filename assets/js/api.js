export async function fetchData(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data) throw new Error("Unable to fetch the data");
    return data;
  } catch (error) {
    console.error(error);
  }
}
