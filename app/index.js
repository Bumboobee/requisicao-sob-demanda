const API_URL = 'http://localhost:3000/'
const ROTTEN_URL = 'https://www.rottentomatoes.com/'

let counterObj = 0;

async function consumeAPI(signal) {
    const response = await fetch(API_URL, {
        signal
    }) 
    const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(parseNDJSON())
        // .pipeTo(new WritableStream({
        //     write(chunk) {
        //         console.log(++counter, 'chunk', chunk)
        //     }            
        // }))

        return reader
}

function appendToHtml(element) {
    return new WritableStream({
        write({ title, description, directors, gender, release, link }) {
            document.getElementById('counter').innerHTML = counterObj++;

            const card = `
            <article>
                <div class="text">
                    <div class="header-card"">
                        <h4>${title}</h4>                      
                        <div>
                            <a href="${ROTTEN_URL+link}" target="_blank"><i class="fas fa-external-link-square-alt"></i></a>
                        </div>    
                    </div>
                    <div>
                        <p><span class="badge bg-warning text-dark">${gender}</span></p>                   
                        <p class="text-secondary">${description.length > 250 ? (description.slice(0, 250) + '<strong>...</strong>') :  description.slice(0, 250)}</p>
                    </div>
                    <div class="footer-card">
                        <h5>${directors}</h5>
                        <p><span class="badge bg-secondary">${release}</span></p>
                    </div>
                </div>
            </article>`

            element.innerHTML += card
        },
        abort(reason) {
            console.log('aborted')
        }
    })
}

// função que certifica se dois chunks cheguem em uma unica requisição converta corretamente para json
// dado: {}\n{}
// deve 
//     {}
//     {}
function parseNDJSON() {
    let ndjsonBuffer = ''
    return new TransformStream({
        transform(chunk, controller) {
            // concatenar
            ndjsonBuffer += chunk
            const items = ndjsonBuffer.split('\n')
            items.slice(0, -1)
                .forEach(item => controller.enqueue(JSON.parse(item)))
            
            ndjsonBuffer = items[items.length -1]    
        },
        flush(controller) {
            if(!ndjsonBuffer) return;
            controller.enqueue(JSON.parse(ndjsonBuffer))           
        }
    })
}

const [
    start,
    cancel,
    cards
] = ['start', 'cancel', 'cards'].map(item => document.getElementById(item))

let abortController = new AbortController()

start.addEventListener('click', async () => {
    callMessage('Iniciado...', '#0B5ED7')
    const readable = await consumeAPI(abortController.signal)
    readable.pipeTo(appendToHtml(cards))
})

cancel.addEventListener('click', () => {
    abortController.abort()
    console.log('aborting...')
    abortController = new AbortController()
    callMessage('Requisição Cancelada!', '#BB2D3B')
})

function callMessage(text, bgColor) {
    Snackbar.show({ 
        text: text,
        duration: 2500,
        actionTextColor: '#FFFFED',
        backgroundColor: bgColor,
        actionText: 'Fechar'
    });
}
//entra na pasta: cd app

//se for primera vez: npm init 
//start na aplicacao: npm start