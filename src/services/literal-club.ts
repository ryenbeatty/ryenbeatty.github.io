const ENDPOINT = 'https://literal.club/graphql/'

export const getToken = async () => {
  const login = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
            email
            languages
            profile {
              id
              handle
              name
              bio
              image
            }
          }
        }
        `,
      variables: {
        email: process.env.LITERAL_CLUB_EMAIL,
        password: process.env.LITERAL_CLUB_PASSWORD,
      },
    }),
  })

  const result = await login.json()
  return result?.data?.login?.token
}

export const getShelf = async (shelfSlug: string) => {
  const shelf = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      query: `
      query getShelfBySlug($shelfSlug: String!) {
        shelf(where: { slug: $shelfSlug }) {
          books {
            id
            slug
            title
            subtitle
            description
            isbn10
            isbn13
            language
            pageCount
            publishedDate
            publisher
            cover
            authors {
              id
              name
            }
            gradientColors
          }
        }
      }
      `,
      variables: {
        shelfSlug,
      },
    }),
  })

  const shelfData = await shelf.json()
  const { books } = shelfData.data.shelf

  return books
}

export interface Book {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  isbn10: string
  isbn13: string
  language: string
  pageCount: string
  publishedDate: string
  publisher: string
  cover: string
  authors: {
    id: string
    name: string
  }
  gradientColors: string[]
}
