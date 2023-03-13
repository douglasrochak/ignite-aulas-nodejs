import http from 'node:http'
import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { json } from './middlewares/json.js'

const database = new Database()

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  if (method === 'GET' && url === '/users') {
    const result = database.selec('users')

    return res.end(JSON.stringify(result))
  }


  if (method === 'POST' && url === '/users') {
    const { name, email } = req.body

    const user = {
      id: randomUUID(),
      name,
      email
    }

    database.insert('users', user)
    return res.writeHead(201).end()
  }

  return res.writeHead(404).end()
})

server.listen(3333)