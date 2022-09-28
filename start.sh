#!bin/bash

## Criação de arquivo de configuração
locdir=$(pwd)                                                                   # Define local de instalação do app FBW
if [ ! -e "$locdir"/var ] ; then                                                # Condicional para verificar a existência de var/
  mkdir "$locdir"/var                                                           # Cria diretório de configuração
fi

## Emissão de relatório de saída
while : 
do                                             
  numeral=$(date '+%Y-%m-%d %H:%M:%S')                                          # Valor acessório para caracterização de numeral característico
  arquivo=$(echo "FBW $numeral.log")                                            # Define um número de série para o log
  touch "$locdir"/var/"$arquivo"                                                # Cria arquivo de saída de dados no doretório
  echo " # [FBW]: $numeral">> "$locdir"/var/"$arquivo"
  node  "$locdir"/index.js >> "$locdir"/var/"$arquivo"                          # Salva log de execução no arquivo criado
  sleep 300                                                                     # Executa de forma contínua, em caso de interrupção por ausência de conexão
done