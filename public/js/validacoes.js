//funções utilitárias

//atalho para pegar elemento por ID
const $ = id  => document.getElementById(id);

//remover caracteres não númericos de uma string
function onlyDigits(str){
    return String(str || '').replace(/\D/g,'');
}


//validação do CPF
function validateCPF(cpf){
    cpf = onlyDigits(cpf); //Remove pontos, traços e mantém só numeros
    if (cpf.length !== 11) 
        return false; //verifica se tem 11 caracteres
    if(/^(\d)\1+$/.test(cpf))
        return false; //elimina CPFs com todos os dígitos iguais

    let sum = 0;
    for (let i=0; i<9; i++) 
        sum += parseInt(cpf.charAt(i), 10) * (10-i);
    let rest = (sum * 10) % 11; //Regra de cálculo
    rest = rest === 10 ? 0 : rest; //Se der 10, vira 0
    if (rest !== parseInt(cpf.charAt(9), 10))
        return false; //confere com o 10º digito

    sum = 0; //zera para verificar o 11º digito
    for (let i=0; i<10; i++)
        sum += parseInt(cpf.charAt(i), 10) * (11 - i);
    rest = (sum * 10) % 11;
    rest = rest === 10 ? 0 : rest;
    if (rest !== parseInt(cpf.charAt(10), 10))
        return false; //confere com o 11º digito

    return true; //se tudo certo retorna CPF é válido
}

//validação CNPJ
function validateCNPJ(cnpj){
    cnpj = onlyDigits(cnpj); //remove carateres não numéricos
    if (cnpj.length !== 14)
        return false; //cnpj deve ter 14 dígitos
    if (/^(\d)\1+$/.test(cnpj))
        return false; //elimina cnpjs com todos os 
                        //dígitos iguais

    //função auxiliar que calcula cada dígito verificador
    const calc = (slice, weigths) => {
        let sum = 0;
        for (let i=0; i < weigths.length; i++)
            sum += parseInt(slice.charAt(i), 10)*weigths[i];
        const r = sum % 11;
        //regra do cnpj: se resto < 2, vira 0; senão, 11 - resto
        return r < 2 ? 0 : 11 - r; 
        
    };
        //pesos do primeiro digito verificador
        const w1 = [5,4,3,2,9,8,7,6,5,4,3,2];
        // calcula primeiro dv
        const d1 = calc(cnpj.substring(0,12), w1); 
        if(d1 !== parseInt(cnpj.charAt(12), 10))
            return false;

        //pesos do segundo digito verificador
        const w2 = [6,5,4,3,2,9,8,7,6,5,4,3,2];
        //calcula segundo dv
        const d2 = calc(cnpj.substring(0,13), w2);
        //confere com 14º digito
        if (d2 !== parseInt(cnpj.charAt(13), 10))
            return false;

        return true; //se passou em tudo, CNPJ é válido     
}




//alternar os campos PF e PJ
const tipo = $('tipo'); //select onde o usuário escolhe PF/PJ
const fieldsPF = $('fieldsPF'); // div de pessoa física
const fieldsPJ = $('fieldsPJ'); // div de pessoa jurídica
const campoCNPJ = $('cnpj'); // captura o campo cnpj
const campoCPF = $('cpf'); // captura o campo cpf

//Quando o usuário muda a seleção de PF/PJ
tipo && tipo.addEventListener('change', ()=> {
    if(tipo.value === 'PF'){
        fieldsPF.style.display = ''; //mostra campos PF
        fieldsPJ.style.display = 'none'; //esconde PJ
        campoCNPJ.removeAttribute('required'); //remove o atributo required do campo e evita erro de validação de campo oculto
    }else if (tipo.value === 'PJ'){
            fieldsPF.style.display = 'none'; //esconde PF
            fieldsPJ.style.display = ''; // mostrar Pj
            campoCPF.removeAttribute('required');  //remove o atributo required do campo e evita erro de validação de campo oculto
        }
        else{
            fieldsPF.style.display = 'none'; //esconde pf
            fieldsPJ.style.display = 'none'; //esconde pj
        }
});

//exibe mensagem no topo do formulário
//caso tenha sucesso ou erro na gravação dos dados
function mostrarMensagem(texto, tipo = 'success'){
    const css = tipo === 'error' ? 'alert-danger' : 'alert-success';
    mensagem.innerHTML = `<div class="alert ${css}">${texto}</div>`;
}

//envio do formulário através do evento de clique no botão
formCadastro.addEventListener('submit', async (e) => {
    //evita recarregar a página
    e.preventDefault();

    //capturar os dados no formúlario
    const dadosCadastro = {
        tipo: tipo.value,
        nome: $('nome').value.trim(),
        cpf: $('cpf').value.trim(),
        dataNascimento: $('data_nascimento').value,
        cnpj: $('cnpj').value.trim(),
        razaoSocial: $('razao_social').value.trim(),
        email: $('email').value.trim(),
        senha: $('senha').value,
    };

    //validação email
    if(!dadosCadastro.email || !dadosCadastro.email.includes('@')){
        return mostrarMensagem('Digite um email inválido.', 'error');
    }

    try{
        const res = await fetch('http://localhost:3000/cadastrar', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dadosCadastro)
        });

        const resultado = await res.json();
        if(res.ok){
            mostrarMensagem(resultado.message, 'success');
            formCadastro.reset();
            campoCPF.style.display = 'none';
            campoCNPJ.style.display = 'none';
        }else{
            mostrarMensagem(data.message || 'Erro no cadastro.', 'error');
        } 
    } catch (error){
        mostrarMensagem('Erro ao conectar no servidor.', 'error');
    }

});