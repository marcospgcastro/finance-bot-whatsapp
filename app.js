const FBW = () => {
  const { Client, LocalAuth } = require('whatsapp-web.js');
  const code = require('qrcode-terminal');
  const tool = require('./components');

  // Use the saved values
  const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "client-one",
        puppeteer: {
          args: ['--no-sandbox','--disable-setuid-sandbox'],
        } 
    })
  });

  client.on('qr', qr => {
      code.generate(qr, {small: true});
  });

  client.on('ready', () => {
      console.log(` # FinanceBot está operacional!`);
  });

  // Evoca ação pelo Cliente - Inserção de dados
  client.on('message', message => {
    let comando = tool.selector(message.body);
    if(comando[0] == '#' ) {
      
      switch (comando[1]){
        case `menu`:
          const man = `Para consultas na data atual insira:\n`+
                      `#  + Código da ação\n`+
                      `Ex: # VALE3\n\n`+

                      `Consulta por data específica insira:\n`+
                      `# + Código da ação + data\n`+
                      `Ex: # BBDC4 20/09/2022\n\n`+

                      `Para consulta por período insira:\n`+ 
                      `# + Código da ação + data inicial + final\n`+
                      `Ex: # PETR4 01/03/2022 11/03/2022`;
                      
          client.sendMessage(message.from, man);
          break;

        case `info`:
          const pro = `Profissional | Feedback | Bug Report\n`+
          `https://www.linkedin.com/in/marcospgcastro`
          client.sendMessage(message.from, pro);
          break;

        default:
      
        // Citação de Linus Torvalds  - Falar é fácil, me mostre o código!
        if(`${comando.length}` == 1) {
          client.sendMessage(message.from, 
            `\nFalar é fácil, me mostre o código!\n`);
        }  

        // Busca pela função historyBot, data vigente -> função financeBot
        if(`${comando.length}` == 2 ) {

          // Teste para validação de ação inserida
          if ( tool.confere(comando[1]) ) {

            // Busca por dados financeiros da referente empresa - FinanceBot
            tool.financeBot(comando[1], (flux) => { 
              client.sendMessage(message.from, flux)
            });
          } else {

            // Feedback para data não validada
            client.sendMessage(message.from, 
            `Insira o código da ação em formato válido - BOVESPA¹`)
          }
        }

        // Busca pela função historyBot, na data específica
        if(`${comando.length}` == 3 ) { 

          // Teste para validação de ação inserida
          if( tool.confere(comando[1]) ) {

            // Teste para validação de data inserida
            if(tool.checkDate(comando[2])) {

              // Aviso para buscas no dia vigente, retornando o valor de FinanceBot e não HistoryBot
              if(comando[2] == tool.setToday()) {

                // Busca por dados financeiros da referente empresa - FinanceBot
                tool.financeBot(comando[1], (flux) => { 
                  client.sendMessage(message.from, flux)
                });

                // Conferencia de mercado para BOVESPA aberta
                const hora = new Date().toLocaleTimeString();
                if('18:00:00' > hora && '10:00:00' < hora) {
                  const wry = `\nConsultas datadas no dia vigente apresentarão `+
                  `valores recentes do mercado, podendo haver disparidades com `+
                  `seu homebroker caso a BOVESPA esteja aberta.\n`;
                  client.sendMessage(message.from, wry)
                }

              }else {

                // Busca por dados financeiros da referente empresa - HistoryBot
                tool.historyBot(comando[1], comando[2], comando[2], (flux) => { 
                  client.sendMessage(message.from, flux)
                });
              }
            } else {

              // Feedback para data não validada
              client.sendMessage(message.from, 
                `Insira uma data válida,\n no formato: DD/MM/AAAA.`);
            }
          } else {

            // Feedback para ação não validada
            client.sendMessage(message.from, 
              `Insira o código da ação em formato válido - BOVESPA²`)
          }
        }

        // Busca pela função historyBot, parâmetros completos - período pré definido.
        if(`${comando.length}` == 4 ) {

          // Teste para validação de ação inserida
          if( tool.confere(comando[1]) ) {

            // Inverte a posição das datas final --> inicial
            const first  = new Date(tool.formeDate(comando[2]))
            const second = new Date(tool.formeDate(comando[3]))
            if( first > second ) {
              const aux  = comando[2]
              comando[2] = comando[3]
              comando[3] = aux
            }

            // Teste para validação de data inserida
            if(tool.checkDate(comando[2]) && tool.checkDate(comando[3])) {  

              // Busca por dados financeiros da referente empresa
              tool.historyBot(comando[1], comando[2], comando[3], (flux) => { 
                client.sendMessage(message.from, flux)
              });
            } else {

              // Feedback para data não validada
              client.sendMessage(message.from, 
            `Insira datas válidas,\n no formato: DD/MM/AAAA.`);
            }  
          } else {

            // Feedback para ação não validada
            client.sendMessage(message.from, 
            `Insira o código da ação em formato válido - BOVESPA³.`)
          }
        }
      }
    } // Fecha o comando evocador por #         
  });

  client.initialize();
}  
module.exports = {
  FBW
};