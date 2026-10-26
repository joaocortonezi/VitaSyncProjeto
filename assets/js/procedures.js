/* === PROCEDIMENTOS === */
exigirLogin();

const procedimentoForm = document.querySelector('#procedimentoForm');
const nomeInput = document.querySelector('#nome');
const duracaoInput = document.querySelector('#duracao');
const precoInput = document.querySelector('#preco');
const descricaoInput = document.querySelector('#descricao');
const nomeError = document.querySelector('#nomeError');
const procedimentosLista = document.querySelector('#procedimentosLista');

/* === 1. PREÇO === */
/* "120,50" -> 120.5. DEVOLVE NaN SE NÃO FOR UM NÚMERO */
function lerPreco(texto) {
    return Number(texto.replace(',', '.'));
}

/* DEIXA SÓ NÚMEROS E UMA VÍRGULA, COM NO MÁXIMO 2 CASAS: 120,50 */
function mascaraPreco(valor) {
    const [inteiro, ...resto] = valor.replace(/[^\d,]/g, '').split(',');
    return resto.length ? `${inteiro},${resto.join('').slice(0, 2)}` : inteiro;
}

precoInput.addEventListener('input', () => {
    precoInput.value = mascaraPreco(precoInput.value);
    precoInput.setCustomValidity(lerPreco(precoInput.value) > 0 ? '' : 'Digite um preço maior que zero.');
});

nomeInput.addEventListener('input', () => {
    nomeError.hidden = true;
});

/* === 2. LISTA === */
function renderizarProcedimentos() {
    const procedimentos = lerDados('procedimentos');

    procedimentosLista.replaceChildren(); /* LIMPA A LISTA ANTES DE DESENHAR DE NOVO */

    if (procedimentos.length === 0) {
        const vazio = document.createElement('li');
        vazio.className = 'procedures__empty';
        vazio.textContent = 'Nenhum procedimento cadastrado';
        procedimentosLista.append(vazio);
        return;
    }

    procedimentos.forEach(procedimento => {
        const item = document.createElement('li');
        item.className = 'procedures__item';
        if (procedimento.descricao) item.title = procedimento.descricao;

        const nome = document.createElement('span');
        nome.textContent = procedimento.nome;

        const info = document.createElement('span');
        info.className = 'procedures__item-info';
        info.textContent = `${procedimento.duracao} min · ${formatarValor(procedimento.valor)}`;

        item.append(nome, info);
        procedimentosLista.append(item);
    });
}

/* === 3. CADASTRO === */
procedimentoForm.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const procedimentos = lerDados('procedimentos');
    const nome = nomeInput.value.trim();

    /* CHECAGEM ANTES DE SALVAR: NOME REPETIDO NÃO ENTRA (IGNORA MAIÚSCULAS) */
    if (procedimentos.some(procedimento => procedimento.nome.toLowerCase() === nome.toLowerCase())) {
        nomeError.hidden = false;
        return;
    }

    procedimentos.push({
        id: gerarId(procedimentos),
        nome,
        duracao: Number(duracaoInput.value),
        valor: lerPreco(precoInput.value),
        descricao: descricaoInput.value.trim()
    });

    salvarDados('procedimentos', procedimentos);
    procedimentoForm.reset();
    renderizarProcedimentos();
});

/* "CANCELAR" LIMPA O FORM E ESCONDE O AVISO */
procedimentoForm.addEventListener('reset', () => {
    nomeError.hidden = true;
});

renderizarProcedimentos();
