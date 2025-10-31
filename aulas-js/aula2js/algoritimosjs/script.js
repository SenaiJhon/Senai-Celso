// 1 - Soma entre A e B e comparação com C
let A = parseFloat(prompt("1) Digite o valor de A:"));
let B = parseFloat(prompt("Digite o valor de B:"));
let C = parseFloat(prompt("Digite o valor de C:"));
let soma = A + B;
alert(`A soma entre A e B é ${soma}`);
alert(soma < C ? "A soma é menor que C" : "A soma não é menor que C");

// 2 - Par ou ímpar, positivo ou negativo
let numero = parseFloat(prompt("2) Digite um número qualquer:"));
alert(numero % 2 === 0 ? "Número par" : "Número ímpar");
alert(numero >= 0 ? "Número positivo" : "Número negativo");

// 3 - Soma ou multiplicação de A e B
A = parseInt(prompt("3) Digite o valor inteiro de A:"));
B = parseInt(prompt("Digite o valor inteiro de B:"));
let resultadoC = (A === B) ? A + B : A * B;
alert(`O valor de C é ${resultadoC}`);

// 4 - Antecessor e sucessor
numero = parseInt(prompt("4) Digite um número inteiro:"));
alert(`Antecessor: ${numero - 1}`);
alert(`Sucessor: ${numero + 1}`);

// 5 - Quantos salários mínimos o usuário ganha
let salarioMinimo = parseFloat(prompt("5) Digite o valor do salário mínimo:"));
let salarioUsuario = parseFloat(prompt("Digite o valor do seu salário:"));
let quantidade = salarioUsuario / salarioMinimo;
alert(`Você ganha ${quantidade.toFixed(2)} salários mínimos`);

// 6 - Reajuste de 5%
valor = parseFloat(prompt("6) Digite um valor para reajuste de 5%:"));
let reajuste = valor * 1.05;
alert(`Valor com reajuste de 5%: R$ ${reajuste.toFixed(2)}`);

// 7 - Verificar se ambos são verdadeiros ou falsos
let valor1 = prompt("7) Digite 'true' ou 'false' para o primeiro valor:") === "true";
let valor2 = prompt("Digite 'true' ou 'false' para o segundo valor:") === "true";
if (valor1 && valor2) {
  alert("Ambos são VERDADEIROS");
} else if (!valor1 && !valor2) {
  alert("Ambos são FALSOS");
} else {
  alert("Os valores são diferentes");
}

// 8 - Ordenar três valores em ordem decrescente
let x = parseInt(prompt("8) Digite o primeiro valor inteiro:"));
let y = parseInt(prompt("Digite o segundo valor inteiro:"));
let z = parseInt(prompt("Digite o terceiro valor inteiro:"));
let valores = [x, y, z];
valores.sort((a, b) => b - a);
alert(`Valores em ordem decrescente: ${valores.join(", ")}`);

// 9 - Média de três notas
let nota1 = parseFloat(prompt("9) Digite a primeira nota:"));
let nota2 = parseFloat(prompt("Digite a segunda nota:"));
let nota3 = parseFloat(prompt("Digite a terceira nota:"));
let media = (nota1 + nota2 + nota3) / 3;
alert(`Média das notas: ${media.toFixed(2)}`);

// 10 - Média de quatro notas e aprovação
let aluno = prompt("10) Digite o nome do aluno:");
let n1 = parseFloat(prompt("Digite a primeira nota:"));
let n2 = parseFloat(prompt("Digite a segunda nota:"));
let n3 = parseFloat(prompt("Digite a terceira nota:"));
let n4 = parseFloat(prompt("Digite a quarta nota:"));
let mediaFinal = (n1 + n2 + n3 + n4) / 4;
alert(`Aluno: ${aluno}`);
alert(`Média: ${mediaFinal.toFixed(2)}`);
alert(mediaFinal >= 7 ? "Aprovado" : "Reprovado");

// 11 - Valor final do produto conforme forma de pagamento
let valorProduto = parseFloat(prompt("1ss1) Digite o valor do produto:"));
let codigoPagamento = parseInt(prompt(
  "Escolha a forma de pagamento:\n1 - Dinheiro/Pix (15% desconto)\n2 - Cartão à vista (10% desconto)\n3 - Cartão 2x (sem juros)\n4 - Cartão 3x+ (10% juros)"
));
let valorFinal;

switch (codigoPagamento) {
  case 1:
    valorFinal = valorProduto * 0.85;
    break;
  case 2:
    valorFinal = valorProduto * 0.90;
    break;
  case 3:
    valorFinal = valorProduto;
    break;
  case 4:
    valorFinal = valorProduto * 1.10;
    break;
  default:
    alert("Código inválido");
    valorFinal = null;
}

if (valorFinal !== null) {
  alert(`Valor final a ser pago: R$ ${valorFinal.toFixed(2)}`);
}
