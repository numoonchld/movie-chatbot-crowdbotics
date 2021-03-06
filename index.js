const express = require('express')
const http = require('http')

require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/ping', async (req, res) => {
    res.status(200).send('Ping Successful.')
})

app.post('/getmovie', async (req, res) => {
    
    const movieToSearch = req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.movie ? req.body.result.parameters.movie : ''
    console.log(movieToSearch)

    const reqUrl = encodeURI(`http://www.omdbapi.com/?t=${movieToSearch}&apikey=${process.env.API_KEY}`)

    await http.get(reqUrl, responseFromAPI => {
        let completeResponse = ''
        responseFromAPI.on('data', chunk => {
            completeResponse += chunk
        })
        responseFromAPI.on('end', () => {
            const movie = JSON.parse(completeResponse)
            let dataToSend = movieToSearch
            dataToSend = `${movie.Title} was released in the year ${movie.Year}. It is directed by ${movie.Director} and stars ${movie.Actors}.\n Here some glimpse of the plot: ${movie.Plot}. }`
            return res.json({ fulfillmentText: dataToSend, source: 'getmovie' })
        })
    }, error => {
        console.log(error)
        return res.json({ fulfillmentText: 'Could not get results at this time', source: 'getmovie' })
    })
})

app.listen(port, async () => {
    console.log(`🌏 Server is running at http://localhost:${port}`)
})