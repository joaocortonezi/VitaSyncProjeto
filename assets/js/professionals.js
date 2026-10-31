/* === PROFISSIONAIS === */
exigirLogin();

const profissionalForm = document.querySelector('#profissionalForm');
const nomeInput = document.querySelector('#nome');
const cpfInput = document.querySelector('#cpf');
const telefoneInput = document.querySelector('#telefone');
const tipoRegistroSelect = document.querySelector('#tipoRegistro');
const numeroRegistroInput = document.querySelector('#numeroRegistro');
const especialidadeInput = document.querySelector('#especialidade');
const procedimentosLista = document.querySelector('#procedimentosLista');
const procedimentoTemplate = document.querySelector('#procedimentoTemplate');
const profissionaisLista = document.querySelector('#profissionaisLista');
const cpfError = document.querySelector('#cpfError');
const salvoAviso = document.querySelector('#salvoAviso');

let checkboxes = []; /* UM CHECKBOX POR PROCEDIMENTO CADASTRADO */

/* === 1. MÁSCARAS === */
/* mascaraCpf E mascaraTelefone FICAM EM scripts.js, POIS A PÁGINA DE CLIENTES TAMBÉM USA */
cpfInput.addEventListener('input', () => {
    cpfInput.value = mascaraCpf(cpfInput.value);
    cpfInput.setCustomValidity(cpfInput.value.length === 14 ? '' : 'Digite o CPF completo.');
    cpfError.hidden = true;
});

telefoneInput.addEventListener('input', () => {
    telefoneInput.value = mascaraTelefone(telefoneInput.value);
    telefoneInput.setCustomValidity(telefoneInput.value.length === 16 ? '' : 'Digite o telefone completo.');
});

/* === 2. PROCEDIMENTOS === */
function preencherProcedimentos() {
    const procedimentos = lerDados('procedimentos');

    /* SEM PROCEDIMENTO CADASTRADO NÃO TEM O QUE MARCAR */
    if (procedimentos.length === 0) {
        const aviso = document.createElement('p');
        aviso.className = 'professionals__empty';
        aviso.innerHTML = 'Nenhum procedimento cadastrado. <a href="procedures.html">Cadastre um procedimento</a> primeiro.';
        procedimentosLista.append(aviso);
        return;
    }

    checkboxes = procedimentos.map(procedimento => {
        const item = procedimentoTemplate.content.cloneNode(true).firstElementChild;
        const checkbox = item.querySelector('input[type="checkbox"]');

        checkbox.value = procedimento.id;
        item.querySelector('.professionals__procedure-text').textContent =
            `${procedimento.nome} · ${procedimento.duracao} min`;

        procedimentosLista.append(item);
        return checkbox;
    });
}

/* PELO MENOS UM PROCEDIMENTO. O AVISO APARECE NO PRIMEIRO CHECKBOX */
function validarProcedimentos() {
    if (checkboxes.length === 0) return;

    const algumMarcado = checkboxes.some(checkbox => checkbox.checked);
    checkboxes[0].setCustomValidity(algumMarcado ? '' : 'Selecione pelo menos um procedimento.');
}

procedimentosLista.addEventListener('change', validarProcedimentos);

/* === 3. LISTA === */
function renderizarProfissionais() {
    const profissionais = lerDados('profissionais');

    profissionaisLista.replaceChildren(); /* LIMPA A LISTA ANTES DE DESENHAR DE NOVO */

    if (profissionais.length === 0) {
        const vazio = document.createElement('li');
        vazio.className = 'professionals__empty';
        vazio.textContent = 'Nenhum profissional cadastrado';
        profissionaisLista.append(vazio);
        return;
    }

    profissionais
        .sort((a, b) => a.nome.localeCompare(b.nome))
        .forEach(profissional => {
            const item = document.createElement('li');
            item.className = 'professionals__item';

            const nome = document.createElement('span');
            nome.textContent = profissional.nome;

            /* PROFISSIONAL ANTIGO, DE ANTES DO FORMULÁRIO, NÃO TEM REGISTRO */
            const registro = profissional.tipoRegistro ? `${profissional.tipoRegistro} ${profissional.numeroRegistro}` : '';

            const info = document.createElement('span');
            info.className = 'professionals__item-info';
            info.textContent = [registro, profissional.especialidade].filter(Boolean).join(' · ');

            item.append(nome, info);
            profissionaisLista.append(item);
        });
}

/* === 4. CADASTRO === */
profissionalForm.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const profissionais = lerDados('profissionais');

    /* CHECAGEM ANTES DE SALVAR: CPF REPETIDO NÃO ENTRA */
    if (profissionais.some(profissional => profissional.cpf === cpfInput.value)) {
        cpfError.hidden = false;
        salvoAviso.hidden = true;
        return;
    }

    profissionais.push({
        id: gerarId(profissionais),
        nome: nomeInput.value.trim(),
        cpf: cpfInput.value,
        telefone: telefoneInput.value,
        tipoRegistro: tipoRegistroSelect.value,
        numeroRegistro: numeroRegistroInput.value.trim(),
        especialidade: especialidadeInput.value.trim(),
        procedimentos: checkboxes.filter(checkbox => checkbox.checked).map(checkbox => Number(checkbox.value))
    });

    salvarDados('profissionais', profissionais);
    profissionalForm.reset();
    renderizarProfissionais();
    salvoAviso.hidden = false;
});

/* O reset ACONTECE DEPOIS DO EVENTO, ENTÃO O setTimeout CONFERE OS CHECKBOXES JÁ DESMARCADOS */
profissionalForm.addEventListener('reset', () => {
    cpfError.hidden = true;
    setTimeout(validarProcedimentos);
});

/* O AVISO DE SUCESSO SOME QUANDO A PESSOA COMEÇA UM NOVO CADASTRO */
profissionalForm.addEventListener('input', () => {
    salvoAviso.hidden = true;
});

preencherProcedimentos();
validarProcedimentos();
renderizarProfissionais();
