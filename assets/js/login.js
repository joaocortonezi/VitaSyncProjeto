/* === LOGIN === */
/* USUÁRIO FIXO, JÁ QUE NÃO EXISTE CADASTRO DE USUÁRIOS */
const USUARIO = {
    email: 'recepcao@vitasync.com',
    senha: '123456'
};

/* SE JÁ ESTÁ LOGADO, VAI DIRETO PARA A AGENDA */
if (usuarioLogado()) {
    window.location.href = 'pages/schedule.html';
}

const loginForm = document.querySelector('#loginForm');
const loginError = document.querySelector('#loginError');

loginForm.addEventListener('submit', (evento) => {
    evento.preventDefault(); /* IMPEDE O FORM DE RECARREGAR A PÁGINA */

    const email = document.querySelector('#email').value.trim();
    const senha = document.querySelector('#senha').value;
    const lembrar = document.querySelector('input[name="lembrar"]').checked;

    if (email !== USUARIO.email || senha !== USUARIO.senha) {
        loginError.hidden = false;
        return;
    }

    /* "LEMBRAR ACESSO" MARCADO FICA SALVO; DESMARCADO SOME AO FECHAR O NAVEGADOR */
    const armazenamento = lembrar ? localStorage : sessionStorage;
    armazenamento.setItem('usuarioLogado', email);

    window.location.href = '../pages/schedule.html';
});

/* ESCONDE O ERRO QUANDO A PESSOA VOLTA A DIGITAR */
loginForm.addEventListener('input', () => {
    loginError.hidden = true;
});