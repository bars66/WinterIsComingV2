import fetch from 'isomorphic-fetch';

export default async function fetchGql(query, variables) {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();
  if (result.errors) return {};

  return result.data;
}
