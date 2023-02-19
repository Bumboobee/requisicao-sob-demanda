import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { Readable, Transform } from 'node:stream'
import { WritableStream, TransformStream } from 'node:stream/web'
import { setTimeout } from 'node:timers/promises'
import csvtojson from 'csvtojson'
import moment from 'moment/moment.js'

const PORT = 3000

createServer(async (request, response) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*'
    }

    if (request.method === 'OPTIONS') {
        response.writeHead(204, headers)
        response.end();
        return;
    }

    let items = 0;
    request.once('close', _ => console.log(`connection was closed!`, items))
    Readable.toWeb(createReadStream('./rotten_tomatoes_movies.csv'))
        // o passo a passo que cada item individual vai trafegar
        .pipeThrough(Transform.toWeb(csvtojson()))
        .pipeThrough(new TransformStream({
            transform(chunk, controller) {
                //console.log('chunk', Buffer.from(chunk).toString())

                const data = JSON.parse(Buffer.from(chunk))
                const mappedData = {
                    title: data.movie_title, 
                    description: data.movie_info,
                    gender: data.genres,
                    directors: data.directors,
                    release: moment(data.original_release_date,"YYYY-MM-DD").format("DD-MM-YYYY"),
                    link: data.rotten_tomatoes_link
                }
                // quebra de linha pois é um NDJSON 
                controller.enqueue(JSON.stringify(mappedData).concat('\n'))
            }    
        }))
        // pipeTo é a ultima etapa
        .pipeTo(new WritableStream({
            async write(chunk) {
                // envia os dados sob demanda 
                await setTimeout(150)
                items ++
                response.write(chunk)
            },
            close() {
                response.end()
            }

    }))

    response.writeHead(200, headers);
})
.listen(PORT)
.on('listening', _ => console.log(`server is runing at ${PORT}`))

//entra na pasta: cd server

//se for primera vez: npm init 
//start no servidor: npm run dev