function analisarNumero() {
    const num = parseFloat(document.getElementById("numero").value);
    const resultados = document.getElementById("resultados");
    resultados.innerHTML = `
        <li>O número digitado é ${num}</li>
        <li>O seu valor absoluto é ${Math.abs(num)}</li>
        <li>A sua parte inteira é ${Math.trunc(num)}</li>
        <li>O valor inteiro mais próximo é ${Math.round(num)}</li>
        <li>A sua raiz quadrada é ${Math.sqrt(num)}</li>
        <li>A sua raiz cúbica é ${Math.cbrt(num)}</li>
        <li>O valor de ${num}² é ${Math.pow(num, 2)}</li>
        <li>O valor de ${num}³ é ${Math.pow(num, 3)}</li>
      `;
}