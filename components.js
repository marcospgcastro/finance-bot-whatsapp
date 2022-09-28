
//============================================================================//
const setNewDate = (formLess, add) => {
  let [dia, mes, ano] = `${formLess}`.split('/').map( num => parseInt(num));
  const date = new Date(`${ano}`,`${mes}`,`${dia}`);
  date.setDate(date.getDate()+(`${add}`=='undefined'?0:parseInt(`${add}`)));
  dia = (date.getDate()); 
  mes = (date.getMonth()); 
  ano = (date.getFullYear());
  return (dia<=9?`0${dia}`:`${dia}`)+(mes<=9?`/0${mes}`:`/${mes}`)+`/${ano}`; 
}

//============================================================================//
const setToday = () => {
  const date = new Date();
  const [dia, mes, ano] = [date.getDate(),date.getMonth()+1,date.getFullYear()];
  return (dia<=9?`0${dia}`:`${dia}`)+(mes<=9?`/0${mes}`:`/${mes}`)+`/${ano}`; 
}

//============================================================================//
//    Função que validade do parâmetro data inserido no corpo da mensagem     //
//============================================================================//

const checkDate = (unchecked) => {
  const check = JSON.stringify(unchecked).split('/').map( num => parseInt(num))
  if( check.length == 3 ) {
    const date = new Date(formeDate(unchecked))
    return date instanceof Date && !isNaN(date)
  } else {
    return false
  }
}

//============================================================================//
//Reversor de formato de data padrão "Brasil => EUA" usando "-" como separador//
//============================================================================//

const formeDate = (formLess, add) => {
  let [dia, mes, ano] = `${formLess}`.split('/').map( num => parseInt(num));
  const date = new Date(`${ano}`,`${mes}`,`${dia}`);
  date.setDate(date.getDate()+(`${add}`=='undefined'?0:parseInt(`${add}`)));
  dia = (date.getDate()); 
  mes = (date.getMonth()); 
  ano = (date.getFullYear());
  return `${ano}-`+(mes<=9?`0${mes}-`:`${mes}-`)+(dia<=9?`0${dia}`:`${dia}`); 
}

//============================================================================//
//              Reversor de formato de data padrão "EUA => Brasil"            //
//============================================================================//

const versoDate = (formLess) => {
  const data = new Date(`${formLess}`);
  const [ dia, mes, ano] = [data.getDate(),data.getMonth()+1,data.getFullYear()]
  return (dia<=9?`0${dia}/`:`${dia}/`)+(mes<=9?`0${mes}/`:`${mes}/`)+`${ano}`;   
}

//============================================================================//
//            Função matemática para cálculo de porcentagem                   //
//============================================================================//

const traderGain = (q, p) => {
  return ( q !== 0 ? `${parseFloat(((p/q)-1)*100).toFixed(2)}`: `#.##` );
}  

//============================================================================//
const historyBot = async (code, ini, end, callback) => {

  // Biblioteca da Yahoo que disponibiliza os dados
  const finance = require('yahoo-finance');

  // Condição que verifica validade das datas inseridas
  if(checkDate(ini) === true && checkDate(end) === true) {

    // Função que busca os valores no banco de dados da Yahoo
    await finance.historical({
      symbol: `${code}.SA`,
      from: formeDate(ini),
      to: formeDate(end,`${1}`),
    }).then( (quotes) => {

        // Teste para código válido de ação na BOVESPA 
        if(JSON.stringify(quotes) !== '[]') {

          // Varredura dos resultados obtidos
          for(let i = 0; i < quotes.length; i++) {
            date = `${versoDate(quotes[i].date)}`;
            gain = `${(quotes[i].open<quotes[i].close?'+':'')}`+
                   `${traderGain(quotes[i].open,quotes[i].close)}`;
            open = `${parseFloat(quotes[i].open).toFixed(2)}`;
            maxp = `${parseFloat(quotes[i].high).toFixed(2)}`;
            minp = `${parseFloat(quotes[i].low).toFixed(2)}`;
            last = `${parseFloat(quotes[i].close).toFixed(2)}`;

            // Retorno de valores no formato: Gain % | Máxima | Mínima | Fechamento
            callback(`[${date}]`+` ${code}`.toUpperCase()+`: ${gain}%\n`+
                     `R$ ${open} | ${maxp} ↑ | ${minp} ↓ | ${last}`);
          }    
        } else {

          // Feedback para retorno negativo de ativo na BOVESPA
          callback(`Não foram encontradas operações de ${code} nessa data.`+
                   `Confira o código da ação e a data do pregão.`);
        }
    });
  } else {

    // Feedback para data inválida inserida na busca.
    callback(`Insira uma data válida, no formato: DD/MM/AAAA.`);
  }  
}

//============================================================================//
const selector = ( mensagem ) => {
  const msg = `${mensagem}`.split('')
  const cmd = ( msg[0] == '#' ? true : false )                                  // Busca por histórico da ação
  const crd = ( msg[0] == '$' ? true : false )                                  // Busca por carteira de ações
  const tab = ( msg[1] == ' ' ? true : false )

  let ver = `${mensagem}`.split(' ')
  if(cmd == true && tab == false && msg.length > 1) {
    let aux = `${ver[0]}`.split('#')
    ver.unshift('#')
    ver[1] = aux[1]
  }
  if(crd == true && tab == false && msg.length > 1) {
    let aux = `${ver[0]}`.split('$')
    ver.unshift('$')
    ver[1] = aux[1]
  }
  return ver
}

//============================================================================//
const confere = (cota) => {

  cota = cota.toLowerCase() //verificar se está em formato de ação da BOVESPA
  const Filter = `${cota}`.split('')

  return ( Filter.length == 5 || Filter.length == 6 || Filter.length == 7 ? verificar(Filter) : false )  
}

//============================================================================//
const verificar = ( array ) => {

  // Declaração de vetor Alfa contendo elementos do alfabeto
  const alfa = ['a','b','c','d','e','f','g','h','i','j','k','l','m',
            'n','o','p','q','r','s','t','u','v','w','x','y','z','3']
  // Teste #1
  let steep = false
  for(let i=0; i<alfa.length; i++) {
    if (array[0] == alfa[i]) {
      steep = true
      break
    } 
  }  

  // Teste #2
  if( steep == true) {
    for(let i=0; i<alfa.length; i++) {
      if (array[1] == alfa[i]) {
        steep = true
        break
      } else {
        steep = false
      }
    }
  }  

  // Teste #3
  if( steep == true) {
    for(let i=0; i<alfa.length; i++) {
      if (array[2] == alfa[i]) {
        steep = true
        break
      } else {
        steep = false
      }
    }
  }

  // Teste #4
  if( steep == true) {
    for(let i=0; i<alfa.length; i++) {
      if (array[3] == alfa[i]) {
        steep = true
        break
      } else {
        steep = false
      }
    }
  }

  // Declaração de vetor Nume contendo elementos numéricos
  const nume = ['1','3','4','5','6','f']

  // Teste #5
  if( steep == true) {
    for(let i=0; i<nume.length; i++) {
      if (array[4] == nume[i]) {
        steep = true
        break
      } else {
        steep = false
      }
    }
  }

  // Teste #6
  if( steep == true && array.length >= '6') {
    for(let i=0; i<nume.length; i++) {
      if (array[5] == nume[i]) {
        steep = true
        break
      } else {
        steep = false
      }
    }
  }

    // Teste #7
    if( steep == true && array.length == '7') {
      for(let i=0; i<nume.length; i++) {
        if (array[5] == nume[i]) {
          steep = true
          break
        } else {
          steep = false
        }
      }
    }

  return steep
}

//============================================================================//
const financeBot = async (code, callback) => {

  const finance = require('yahoo-finance');
  await finance.quote({
      symbol: `${code}.SA`,
      modules: ['price', 'summaryDetail']
    }).then( ( snapshot ) => {

        // Teste para código válido de ação na BOVESPA 
        if(JSON.stringify(snapshot) !== '[]') {

          // Varredura dos resultados obtidos
          
            date = `${versoDate(snapshot.price.regularMarketTime)}`;
            gain = `${(snapshot.price.regularMarketOpen<snapshot.price.regularMarketPrice?'+':'')}`+
                   `${traderGain(snapshot.price.regularMarketOpen,snapshot.price.regularMarketPrice)}`;
            open = `${parseFloat(snapshot.price.regularMarketOpen).toFixed(2)}`;
            maxp = `${parseFloat(snapshot.price.regularMarketDayHigh).toFixed(2)}`;
            minp = `${parseFloat(snapshot.price.regularMarketDayLow).toFixed(2)}`;
            last = `${parseFloat(snapshot.price.regularMarketPrice).toFixed(2)}`;

            // Retorno de valores no formato: Gain % | Máxima | Mínima | Fechamento
            callback(`[${date}]`+` ${code}`.toUpperCase()+`: ${gain}%\n`+
                     `R$ ${open} | ${maxp} ↑ | ${minp} ↓ | ${last}`);
            
        } else {

          // Feedback para retorno negativo de ativo na BOVESPA
          callback(`Não foram encontradas operações de ${code} nessa data.`+
                   `Confira o código da ação e a data do pregão.`);
        }
  }); 
}
module.exports = {
  financeBot,
  verificar,
  confere,
  setToday,
  setNewDate,
  checkDate,
  formeDate,
  versoDate,
  traderGain,
  historyBot,
  selector
};