let nome = prompt("digite seu nome");
document.getElementById('nomew').innerText+= " " + nome;

let CalcImC = () => {
    let altura = parseFloat(document.getElementById('altura').value);
    let peso = parseFloat(document.getElementById('peso').value);
    let resultado = document.getElementById('resultado');

    if (isNaN(altura) || isNaN(peso) || altura <= 0 || peso <= 0) {
        resultado.innerText = 'Digite um número válido e maior que zero para altura e peso.';
        return; // interrompe a execução
    }

    let imc = peso / (altura * altura);
    resultado.innerHTML = `Seu IMC é ${imc.toFixed(2)}.- `;

    if (imc < 18.5) {
        resultado.innerHTML += 'Abaixo do peso';
    } else if (imc >= 18.5 && imc <= 24.9) {
        resultado.innerHTML += 'Peso normal';
    } else if (imc >= 25 && imc <= 29.9) {
        resultado.innerHTML += 'Sobrepeso';
    } else if (imc >= 30 && imc <= 34.9) {
        resultado.innerHTML += 'Obesidade grau 1';
    } else if (imc >= 35 && imc <= 39.9) {
        resultado.innerHTML += 'Obesidade grau 2';
    } else { // imc >= 40
        resultado.innerHTML += 'Obesidade grau 3';
    }
};
