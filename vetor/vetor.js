

let ImprimeVet = () => {
    let lala = [];
    let tam = document.getElementById('vet1').value;
    for (let i = 1; i <= tam; i++) {
        if (i % 2 == 0) {
            lala.push(i);
        }
    }
    document.getElementById('stefano').innerHTML += lala;

}
let ImprimeVet2 = () => {
    let vetpar = [71, 55, 30, 11, 22, 10, 35, 63, 7, 5];
    let tamanho = vetpar.length;
    for (let i = 0; i < tamanho; i++) {
        if (vetpar[i] % 2 == 0)
            document.getElementById('Diego').innerHTML += " " + vetpar[i];
    }
}

let emails = [];
let nomes = [];

let cadastrar = () => {
    let nome = document.getElementById('nome').value;
    let email = document.getElementById('email').value;

    if (nome !== "" && email !== "") {
        nomes.push(nome);
        emails.push(email);
    } else {
        alert('preencha os campos corretamente')
    }

}

let consultar = () => {
    alert(emails);
    alert(nomes);
        document.getElementById('Diegojose').innerHTML = 'Nomes cadastrados: ' + nomes + '<br>' +'Emals cadastrados : ' + emails;
    
}
