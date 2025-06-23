moment.locale("pt-br");

let dadosSalvos = [];

function main() {

    const dados = JSON.parse(localStorage.getItem("protocolos"));

    if(dados) {
        dadosSalvos = dados;
        dadosSalvos.forEach(item => {
            renderizarProtocolo(item);
        });
    }


    const formulario = document.getElementById("formulario");
    formulario.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const dados = Object.fromEntries(formData.entries());
        
        if(dados?.protocolo) {
            setProtocolo(dados);
        }
    });
}

function setProtocolo(dados) {
    
    const dia = getDatafinal();
    const protocolo = {
        numero: dados?.protocolo || "",
        dia: dia.format("DD/MM/YYYY"),
        date: dia
    }

    if (protocolo.numero.trim() !== "") {

        const existe = dadosSalvos.find(item => item.numero === protocolo.numero);
        
        if (!existe) {

            const erro = document.getElementById("erro");
            erro.innerHTML = "";              

            dadosSalvos.push(protocolo);
            renderizarProtocolo(protocolo);
            localStorage.setItem("protocolos", JSON.stringify(dadosSalvos));
            const inputProtocolo = document.getElementById("protocolo");

            if (inputProtocolo){
                inputProtocolo.value = ""
            }
        } else {
            const mensagem = document.createElement("div");
            mensagem.className = "erro";
            mensagem.textContent = `O protocolo ${protocolo.numero} já cadastrado!`;

            const erro = document.getElementById("erro");

            erro.innerHTML = "";    
            erro.append(mensagem);
        }
        
    }
    
}

function renderizarProtocolo(protocolo) {

    const divProtocolo = document.createElement("div");
    divProtocolo.className = "protocolo"; 
    divProtocolo.id = protocolo.numero;
    
    const numero = document.createElement("span");
    numero.textContent = protocolo.numero;

    const divDataLixeira = document.createElement("div");
    divDataLixeira.className = "data-lixeira";

    const data = document.createElement("span");
    data.textContent = protocolo.dia;

    const lixeira = document.createElement("img");
    lixeira.src = "./assets/img/lixeira.svg";
    lixeira.className = "lixeira"
    lixeira.onclick = function () {
        deletarProtocolo(protocolo)
    }

    divDataLixeira.append(data, lixeira)

    divProtocolo.append(numero, divDataLixeira);
    
    const protocolos = document.getElementById("protocolos");

    protocolos.append(divProtocolo);

}

function deletarProtocolo(protocolo) {
    
    const index = dadosSalvos.findIndex(item => 
        Object.keys(protocolo).every(key =>
            item[key] === protocolo[key]
        )
    );

    if (index !== -1){
        dadosSalvos.splice(index, 1);
        localStorage.setItem("protocolos", JSON.stringify(dadosSalvos));

        const elemento = document.getElementById(protocolo.numero);
        if (elemento) {
            elemento.remove();
        }
    }


}


function getDatafinal() {
  let dataMoment = moment().startOf("day");
  let diasAdicionados = 0;
  
  while (diasAdicionados < 5) {
    dataMoment = dataMoment.add(1, 'days');
    if (dataMoment.isoWeekday() <= 5) {
      diasAdicionados++;
    }
  }
  
  return dataMoment;
}

main();
