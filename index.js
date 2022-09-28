// Biblioteca npm de recursos do nodejs                                     
const webapp = require('express');
const wppbot = require('./app');
const reader = require('fs');
const status = webapp();   

// Contenção - MaxListenersExceededWarning: Possible EventEmitter memory leak detected.
const EventEmitter = require('events');
const emitter = new EventEmitter()
emitter.setMaxListeners(0)

// Exibe status de execução ao usuário
status.use(
  webapp.json(),                                        
  webapp.urlencoded({ extended: true })
);

// Porta em que HBW está sendo executado
const port = process.env.PORT || 3000;

// status operacional, exibe log atual em formato texto no navegador  
status.get('/', (req, res) => { 

  // Varredura de arquivos e diretórios - "var/".
  if(cont = reader.readdirSync('./var'))                                  
    reader.readFile('./var/'+cont[cont.length-1],'utf-8',
    (error, data) => {

    // Seletor de texto/type  
    res.set({
      'Content-Type':
      'text/plain'
    })
    if (!error) 

      // Emissão de relatório de saída - feedback sobre o funcionamento das principais funções do app.        
      res.send(data);
    else

      // Notificação em caso de ausência de arquivos de log
      res.status(500)
         .send(' Status não pode ser exibido,'
         +'arquivo log não encontrado:  \n\n'+error);
    });
  else

  // Notificação em caso de ausência de arvore de diretórios
  res.status(500)
     .send(' Status não pode ser exibido,'
     +'arvore de diretório inexistente:  \n\n'+error);
});
status.listen(port, () => {

  // Retorna ao usuário host:porta onde é exibido status de execução.
  console.log(` # FBW está setado em http://localhost: ${port}`) 
  try{ 
    wppbot.FBW()
  } catch(err) {
    console.log(` # Falha no módulo FinanceBot: `+err)
  }                                
});