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
        window.location.href = 'index.html';
    }
}

/* === 3. DADOS INICIAIS === */
/* EXEMPLOS PARA TESTAR A AGENDA ENQUANTO AS PÁGINAS DE PROFISSIONAIS E PROCEDIMENTOS NÃO FICAM PRONTAS. SÓ SALVA SE A CHAVE AINDA NÃO EXISTIR */
if (!localStorage.getItem('profissionais')) {
    salvarDados('profissionais', [
        { id: 1, nome: 'Dra. Paula' },
        { id: 2, nome: 'Dr. Marcos' },
        { id: 3, nome: 'Est. Carla' }
    ]);
}

if (!localStorage.getItem('procedimentos')) {
    salvarDados('procedimentos', [
        { id: 1, nome: 'Limpeza de pele', duracao: 60, valor: 120 },
        { id: 2, nome: 'Peeling', duracao: 60, valor: 180 },
        { id: 3, nome: 'Massagem relaxante', duracao: 60, valor: 150 }
    ]);
}

/* BOTÃO "SAIR" DA NAV. O if É PORQUE A TELA DE LOGIN NÃO TEM NAV */
const sairBtn = document.querySelector('#sairBtn');

if (sairBtn) {
    sairBtn.addEventListener('click', () => {
        localStorage.removeItem('usuarioLogado');
        sessionStorage.removeItem('usuarioLogado');
        window.location.href = 'index.html';
    });
}