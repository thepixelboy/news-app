import { gql } from "graphql-request";
import sortNewsByImage from "./sortNewsByImage";
import response from "../response.json";

const fetchNews = async (
  category?: Category | string,
  keywords?: string,
  isDynamic?: boolean
) => {
  // GraphQL query
  const query = gql`
    query MyQuery(
      $access_key: String!
      $categories: String!
      $keywords: String
    ) {
      myQuery(
        access_key: $access_key
        categories: $categories
        countries: "us"
        sort: "published_at"
        keywords: $keywords
      ) {
        data {
          author
          category
          image
          description
          country
          language
          published_at
          source
          title
          url
        }
        pagination {
          count
          limit
          offset
          total
        }
      }
    }
  `;

  // Fetch function with Next.js 13 catching
  const res = await fetch(
    "https://queanbeyan.stepzen.net/api/wandering-robin/__graphql",
    {
      method: "POST",
      cache: isDynamic ? "no-cache" : "default",
      next: isDynamic ? { revalidate: 0 } : { revalidate: 3600 },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Apikey ${process.env.STEPZEN_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        variables: {
          access_key: process.env.MEDIASTACK_API_KEY,
          categories: category,
          keywords: keywords,
        },
      }),
    }
  );

  // console.log(
  //   "LOADING NEW DATA FROM API for category >>> ",
  //   category,
  //   keywords
  // );

  // avoid hitting the API call limit using the response.json file
  // also temporarilly solves the Uncaught TypeError: Cannot read properties of null (reading 'myQuery')
  // const newsResponse = response || (await res.json());
  const newsResponse = await res.json();

  // Sort function by images vs not images present
  const news = sortNewsByImage(newsResponse.data.myQuery);

  // Return the news
  return news;
};

export default fetchNews;
