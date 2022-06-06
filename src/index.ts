import 'dotenv/config'

import readline from 'readline-sync'
import { google } from 'googleapis'
import youtubedl from 'youtube-dl-exec'
import path from 'path'

async function main() {
  const music = {
    name: readline.question('What is the name of the artist? '),
    artist: readline.question('What is the name of the music? '),
    filename: '',
    url: '',
    duration: 0,
  }

  const youtube = google.youtube({
    version: 'v3',
    auth: process.env.GOOGLE_API_KEY
  })

  const { data: { items: searchResult }} = await youtube.search.list({
    maxResults: 1,
    part: ['snippet'],
    q: `${music.artist} ${music.name}`
  })

  const videoId = searchResult && searchResult[0].id?.videoId

  music.url = `https://www.youtube.com/watch?v=${videoId}` || ''
  music.filename = `music_${videoId}`

  await youtubedl(music.url, {
    abortOnError: true,
    output: path.resolve(
      __dirname, '..', 'tmp', 'videos', `${music.filename}.%(ext)s`),
  })

  const result: unknown = await youtubedl(music.url, {
    getDuration: true,
  })

  const duration = result as string

  const [minutes, seconds] = duration.split(':').map(Number)
  music.duration = minutes * 60 + seconds
}

main()
