import 'dotenv/config'
import jwt from '@fastify/jwt'

import multipart from '@fastify/multipart'

import fastify from 'fastify'
import cors from '@fastify/cors'
import { authRoutes } from './routes/auth'
import { uploadRoutes } from './routes/upload'
import { resolve } from 'node:path'
import { publicationsRoutes } from './routes/publications'

const app = fastify()

app.register(multipart)
app.register(require('@fastify/static'), {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads/',
})

app.register(jwt, {
  secret: 'açsldkfdjnfeinvun22n88',
})

app.register(cors, {
  origin: true,
})

app.register(uploadRoutes)
app.register(authRoutes)
app.register(publicationsRoutes)

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => console.log('Server is running!'))
