## Requisição sob demanda
Projeto de criação de api local, com requisições e envios sob demanda.

Esse projeto foi criado tendo como base **[essa](https://www.youtube.com/watch?v=-IpRYbL4yMk)** aula do grande expert em *JavaScrit avançado* e *Node.js*, **[Erick Wendel](https://www.linkedin.com/in/erickwendel/).**
Foi criado uma api local que consome os milhares de dados de um arquivo csv *(base de dados do imdb)*. O back-end faz a conversão desse dados para o formato Json, e depois envia **sob demanda** para o front-end.
O front-end, recebe esses dados na requisição, insere no DOM e limpa a memória. Finalizando, já chama o próximo e faz a mesma coisa. Tudo isso sem qualquer travamento 😎. 

Caso que queira cancelar a requisição, o metodo ```AbortController()```, faz o serviço de cancelar os *requests*!

## Instalação do Projeto
~~~JavaScript 
//root do projeto
cd server 
//sobe o servidor da api 
npm run dev 
~~~

~~~JavaScript 
//root do projeto
cd app 
//sobe o servidor da aplicação 
npm start
~~~
> **NOTA: Instale a última versão do node.js. Problemas de incompatibilidade de versões quanto a depêndicias podem ocorrer.**

<div align="center">

| Dependencias                                                                      |        Bibliotecas                                     |
|-----------------------------------------------------------------------------------|--------------------------------------------------------|
| **[Bootstrap](https://getbootstrap.com/docs/5.1/getting-started/introduction/)**  | **[Node-Snackbar](https://www.polonel.com/snackbar/)** |
| **[csvtojson](https://www.npmjs.com/package/csvtojson)**                          | **[Moment](https://www.npmjs.com/package/moment)**     |

</div>
