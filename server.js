import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

import movieRoutes from './routes/movieRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()

connectDB()

const app = express()
app.use(express.json())
app.use(cors());

app.use('/api/movies', movieRoutes)
app.use('/api/users', userRoutes)


app.get('/', (req, res) => {
    res.send('Welcome to Movie Match API!')
})

// error middleware
app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))