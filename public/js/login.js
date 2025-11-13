//funçao de atalho para pegar elementos por ID
const $l = (id) => document.getElementById(id);

//função para exibir mensagens de login
//mensagens de erro ou sucesso
function showLoginMessage(text, type = 'error'){
    const el = document.getElementById('loginMesagens');
    if(!el) return;
    el.innerHTL = `<div class="alert ${type === 'error' ? 'alert-danger' : 'alert-sucess'}">${text}</div>`;
}

//pegar o formulário de login pelo ID
const formLogin = $l('formLogin');

//verificar se o formulário existe na página
if(formLogin){
    //adiciona o evento de envio(submit) ao formulário
    formLogin.addEventListener('submit', async (e) => {
        //impede qu e a página seja recarregada
        e.preventDefault();

        //pegar os valores digitados pelo usuário
        const email = $l('email').value.trim();
        const password = $l('password').value;

        //verificar se email ou senha estão vazios
        if(!email || !senha)
            return showLoginMessage('Preencha email e senha.');


        try{
            //faz a requisição POST para o backend enviando email e senha
            const res = await fetch('http://localhost:3000/login', {
                method: 'POST',//Método Post para enviar os dados
                headers: {'Content-Type': 'application/json'},//transforma os dados em string JSON
                body: JSON.stringify({email, senha})
            });

            //coneverte a resposta em JSON
            const data = await response.json();

            //se a resposta não for "ok", exibe a mensagem de erro
            if(res.ok){ 
                return showLoginMessage(data.message || 'Erro no login.');
            }

            //salva os dados no localStorage
            //isso não deve ser feito em produção por questões de segurança
            localStorage.setItem('conectamais_user', JSON.stringify(data.user));

            //mostrar mensagem de sucesso
            showLoginMessage('Login realizado com sucesso!', 'success');

            //redireciona o usuário para pagina inicial após 800 ms
            setTimeout(() => {window.location ='/';},800)
        } catch(err){
            //se houver erro na comunicação com o servidor
            console.error('Erro fetch /login' , err);
            showLoginMessage('Erro de conexão com o servidor.');
        }

    });
}