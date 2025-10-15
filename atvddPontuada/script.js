let Tabuada = () => {
    let numero = parseFloat(document.getElementById('NumeroTabuada').value);
    document.getElementById('Tabuadap').innerHTML = ' ';
    for (let i = 1; i <= 10; i++) {
        document.getElementById('Tabuadap').innerHTML += numero * i + '<br>';
    }
}
let SomaDosPares = () => {
    let par = 0;
    for (let i = 2; i <= 100; i += 2) {
        par += i;
    }
    document.getElementById('Q2R').innerText += ' ' + par;
}


let primosfunc = () => {
    let resultado = '';

    for (let i = 2; i <= 100; i++) {
        let ehPrimo = true;

        for (let j = 2; j < i; j++) {
            if (i % j === 0) {
                ehPrimo = false;
                break;
            }
        }

        if (ehPrimo) {
            resultado += ' ' + i;
        }
    }

    document.getElementById('primos').innerText += resultado;
}




function fibonacciLoop() {
    let a = 0;
    let b = 1;
    let c;
    let resultado = a + ' ' + b;

    for (let i = 3; i <= 15; i++) {
        c = a + b;
        resultado += ' ' + c;
        a = b;
        b = c;
    }

    document.getElementById("fibonacci").innerText += resultado;
}

function Contagem() {
    let n = parseInt(document.getElementById('CountN').value);

    for (let i = n; i >= 0; i--) {

        document.getElementById('ContagemRegressiva').innerHTML += '<br>' + i;
    }
}
function multiplos() {
    for (let i = 1; i <= 50; i++) {
        if ((i % 3) === 0 && (i % 5) === 0) {
            document.getElementById('multi5').innerHTML += " " + i;
        }
    }
}
let fatorial = () => {
    let resultFatorial = 1;
    let fatorialN = parseInt(document.getElementById('fatorialN').value);
    for (let i = 1; i <= fatorialN; i++) {
        resultFatorial *= i;
    }
    document.getElementById('Rfatorial').innerText = `O fatorial de ${fatorialN} é :` + resultFatorial;
}
let inverter = () => {
    let invertendo = document.getElementById('invert').value;

    let resultado = '';
    for (let i = invertendo.length - 1; i >= 0; i--) {
        resultado += invertendo[i];
    }

    document.getElementById('invertido').innerText = resultado;
}
let somaDigitos = () => {
    let NumeroDigitos = document.getElementById('digitos').value;

    let somaNumeroDigitos = 0;
    if (NumeroDigitos.length > 1) {
        for (let i = NumeroDigitos.length - 1; i >= 0; i--) {
            somaNumeroDigitos += parseInt(NumeroDigitos[i]);
        }

        document.getElementById('ResultadoDigitos').innerText = `A soma dos Digitos do numero ${NumeroDigitos} é :` + somaNumeroDigitos;

    }
    else {
        document.getElementById('ResultadoDigitos').innerText = 'Escreva um número com + de 1 Dígito';
    }
}
function ContarVogais() {
    let frase = document.getElementById('Frase').value.toLowerCase();
    let contador = 0;
    let vogais = ['a', 'e', 'i', 'o', 'u', 'á', 'à', 'é', 'è', 'í', 'ì', 'ó', 'ò', 'ú', 'ù', 'ã', 'õ', 'â', 'ê', 'î', 'ô', 'û'];

    for (let i = 0; i < frase.length; i++) {
        if (vogais.includes(frase[i])) {
            contador++;
        }
    }

    document.getElementById('ResultadoVogais').innerText = 'O Número de vogais da Frase é: ' + contador;
}
let numeroSecreto = Math.floor(Math.random() * 20) + 1;
let tentativas = 0;

function AdivinheONumero() {
    let palpite = parseInt(document.getElementById('palpites').value);

    while (palpite !== numeroSecreto) {
        tentativas++;
        if (palpite < numeroSecreto) {
            document.getElementById("NumeroAdivinhado").innerText = "Tente um número maior!";
        } else {
            document.getElementById("NumeroAdivinhado").innerText = "Tente um número menor!";
        }
        return; // espera novo palpite
    }

    tentativas++;
    document.getElementById("NumeroAdivinhado").innerText = "Parabéns! Você acertou em " + tentativas + " tentativa(s).";
}

function verificarLogin() {
    const usuarioCorreto = "admin";
    const senhaCorreta = "1234";
    let usuario = document.getElementById("Usuario").value;
    let senha = document.getElementById("senha12").value;

    while (usuario !== usuarioCorreto || senha !== senhaCorreta) {
        alert("Usuário ou senha incorretos. Tente novamente.");
        usuario = prompt("Digite o usuário:");
        senha = prompt("Digite a senha:");
    }

    alert("Login realizado com sucesso!");
}

let totalCaixa = 0;

function registradora() {
    let valor = parseFloat(document.getElementById("valorCaixa").value);

    while (valor !== 0) {
        totalCaixa += valor;
        document.getElementById("totalCaixa").innerText = "Total: R$ " + totalCaixa.toFixed(2);
        return; // espera novo valor
    }

    alert("Encerrando. Total final: R$ " + totalCaixa.toFixed(2));
}

let positivos = 0;

function contarPositivos() {
    let numero = parseInt(document.getElementById("numeroPositivo").value);

    while (numero >= 0) {
        positivos++;
        document.getElementById("resultadoPositivos").innerText = "Positivos digitados: " + positivos;
        return; // espera novo número
    }

    alert("Número negativo digitado. Total de positivos: " + positivos);
}

let notas = [];

function calcularMedia() {
    let nota = parseFloat(document.getElementById("notaMedia").value);

    while (nota !== -1) {
        notas.push(nota);
        document.getElementById("resultadoMedia").innerText = "Notas: " + notas.join(", ");
        return; // espera nova nota
    }

    let soma = notas.reduce((acc, val) => acc + val, 0);
    let media = soma / notas.length;
    document.getElementById("resultadoMedia").innerText = "Média das notas: " + media.toFixed(2);
}

function sortearDados() {
    let dado1, dado2;
    let tentativas = 0;

    while (true) {
        dado1 = Math.floor(Math.random() * 6) + 1;
        dado2 = Math.floor(Math.random() * 6) + 1;
        tentativas++;

        if (dado1 === dado2) break;
    }

    document.getElementById("resultadoDados").innerText = `Dados iguais (${dado1}) após ${tentativas} tentativa(s).`;
}

function verificarPalindromo() {
    let palavra = document.getElementById("palavraPalindromo").value.toLowerCase();
    let invertida = "";
    let i = palavra.length - 1;

    while (i >= 0) {
        invertida += palavra[i];
        i--;
    }

    let resultado = palavra === invertida ? "É um palíndromo!" : "Não é um palíndromo.";
    document.getElementById("resultadoPalindromo").innerText = resultado;
}
function mostrarImpares() {
    let numero = parseInt(document.getElementById("numeroImpar").value);
    let i = 1;
    let resultado = "";

    while (i <= numero) {
        resultado += i + " ";
        i += 2;
    }

    document.getElementById("resultadoImpar").innerText = resultado;
}
let senhaSecreta = "senha123";
let tentativasSenha = 0;

function verificarSenha() {
    let tentativa = document.getElementById("senhaTentativa").value;

    while (tentativa !== senhaSecreta) {
        tentativasSenha++;
        document.getElementById("tentativasSenha").innerText = `Senha incorreta. Tentativas: ${tentativasSenha}`;
        return; // espera nova tentativa
    }

    tentativasSenha++;
    document.getElementById("tentativasSenha").innerText = `Senha correta! Tentativas: ${tentativasSenha}`;
}
function gerarPA() {
    let termo = parseInt(document.getElementById("termoInicial").value);
    let razao = parseInt(document.getElementById("razaoPA").value);
    let resultado = "";
    let contador = 0;

    while (contador < 10) {
        resultado += termo + " ";
        termo += razao;
        contador++;
    }

    document.getElementById("resultadoPA").innerText = resultado;
}
