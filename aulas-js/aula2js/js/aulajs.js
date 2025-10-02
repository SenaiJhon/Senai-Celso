let a = prompt("digite seu nome");
document.getElementById('nomew').innerHTML= a;

let mudacor = () =>{
    document.body.style.backgroundColor= "lightgreen"
}

let soma = () =>{

    if (isNaN(v1) || isNaN(v2) ) {
        document.getElementById('resultado').innerText = 'Digite um Número válido';
    } else {
        let v1 = parseInt(document.getElementById('v1').value);
        let v2 = parseInt(document.getElementById('v2').value);
        let r = v1 + v2;
        document.getElementById('resultado').innerText = r;
    }
    
}