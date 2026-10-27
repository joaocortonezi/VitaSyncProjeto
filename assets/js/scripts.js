/* === 1. LOCALSTORAGE === */
/* LÊ UMA LISTA SALVA (EX.: 'clientes'). SE AINDA NÃO EXISTIR, DEVOLVE UMA LISTA VAZIA */
function lerDados(chave) {
    return JSON.parse(localStorage.getItem(chave)) || [];
}

/* SALVA UMA LISTA, SUBSTITUINDO O QUE ESTAVA SALVO NESSA CHAVE */
function salvarDados(chave, dados) {
    localStorage.setItem(chave, JSON.stringify(dados));
}

/* PRÓXIMO id LIVRE DE UMA LISTA: O MAIOR id + 1 */
function gerarId(lista) {
    return lista.length ? Math.max(...lista.map(item => item.id)) + 1 : 1;
}

/* === 2. LOGIN === */
/* "LEMBRAR ACESSO" MARCADO SALVA NO localStorage (FICA SALVO). DESMARCADO, SALVA NO sessionStorage (SOME AO FECHAR O NAVEGADOR) */
function usuarioLogado() {
    return localStorage.getItem('usuarioLogado') || sessionStorage.getItem('usuarioLogado');
}

/* CHAMADA NO INÍCIO DAS PÁGINAS INTERNAS. SEM LOGIN, VOLTA PARA A TELA DE LOGIN */
function exigirLogin() {
    if (!usuarioLogado()) {
        window.location.href = '../index.html';
    }
}

/* === 3. MÁSCARAS E FORMATAÇÃO === */
/* USADAS EM CLIENTES E PROFISSIONAIS */
/* DEIXA SÓ OS NÚMEROS E VAI COLOCANDO OS PONTOS E O TRAÇO: 000.000.000-00 */
function mascaraCpf(valor) {
    return valor
        .replace(/\D/g, '')
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

/* MESMA IDEIA PARA CELULAR: (66) 9 0000-0000 */
function mascaraTelefone(valor) {
    return valor
        .replace(/\D/g, '')
        .slice(0, 11)
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/\) (\d)(\d)/, ') $1 $2')
        .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
}

/* R$ 120 PARA VALOR INTEIRO E R$ 120,50 QUANDO TEM CENTAVOS */
function formatarValor(valor) {
    const casas = Number.isInteger(valor) ? 0 : 2;
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: casas, maximumFractionDigits: casas });
}

/* BOTÃO "SAIR" DA NAV. O if É PORQUE A TELA DE LOGIN NÃO TEM NAV */
const sairBtn = document.querySelector('#sairBtn');

if (sairBtn) {
    sairBtn.addEventListener('click', () => {
        localStorage.removeItem('usuarioLogado');
        sessionStorage.removeItem('usuarioLogado');
        window.location.href = '../index.html';
    });
}