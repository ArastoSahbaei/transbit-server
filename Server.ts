import express from 'express'
import { errorHandler, notFound } from './src/middlewares'
import { connectToDatabase, connectToPort, useCors, useMorgan } from './src/functions'
import { RouteHandler } from './src/app/routes/RouteHandler'

const application = express()
application.use(express.json())
useCors(application)
useMorgan(application)
RouteHandler(application)
application.use(notFound)
application.use(errorHandler)

connectToDatabase()
connectToPort(application)