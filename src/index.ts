import 'dotenv/config'

import readline from 'readline-sync'
import { google } from 'googleapis'

async function main() {
  const music = readline.question('What is the name of the music? ')
  const artist = readline.question('What is the name of the artist? ')

  const youtube = google.youtube({
    version: 'v3',
    auth: process.env.GOOGLE_API_KEY
  })

  const { data: { items: searchResult }} = await youtube.search.list({
    maxResults: 1,
    part: ['snippet'],
    q: `${music} ${artist}`
  })

  const videoId = searchResult && searchResult[0].id?.videoId

  console.log(`https://www.youtube.com/watch?v=${videoId}`)
}

main()
