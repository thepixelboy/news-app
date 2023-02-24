import { categories } from "../constants";
import fetchNews from "../lib/fetchNews";
import response from "../response.json";

async function Homepage() {
  // fetch the news data
  // avoid hitting the API call limit using the response.json file
  // also temporarilly solves the Uncaught TypeError: Cannot read properties of null (reading 'myQuery')
  const news: NewsResponse =
    response || (await fetchNews(categories.join(",")));
  // await fetchNews(categories.join(","));

  return <div>{/* News List */}</div>;
}
export default Homepage;
