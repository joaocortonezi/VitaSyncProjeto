/* === AGENDA === */
exigirLogin();

const INICIO_EXPEDIENTE = 7 * 60; /* 07:00 EM MINUTOS */
const FIM_EXPEDIENTE = 18 * 60; /* 18:00 EM MINUTOS */
const DIAS_SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const DIAS_ABREVIADOS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

/* GRADE */
const tituloData = document.querySelector('#tituloData');
const diaAnterior = document.querySelector('#diaAnterior');
const diaSeguinte = document.querySelector('#diaSeguinte');
const profissionaisCabecalho = document.querySelector('#profissionaisCabecalho');
const profissionaisColunas = document.querySelector('#profissionaisColunas');
const agendamentoTemplate = document.querySelector('#agendamentoTemplate');

/* MODAL DE NOVO AGENDAMENTO */
const btnNovoAgendamento = document.querySelector('#btnNovoAgendamento');
const formAgendamento = document.querySelector('#formAgendamento');
const clienteSelect = document.querySelector('#cliente');
const profissionalSelect = document.querySelector('#profissional');
const procedimentoSelect = document.querySelector('#procedimento');
const procedimentosLista = document.querySelector('#procedimentosLista');
const procedimentoTemplate = document.querySelector('#procedimentoTemplate');
const dataInput = document.querySelector('#data');
const horaInput = document.querySelector('#hora');
const resumoDuracao = document.querySelector('#resumoDuracao');
const resumoIntervalo = document.querySelector('#resumoIntervalo');
const resumoValor = document.querySelector('#resumoValor');
const alertaConflito = document.querySelector('#alertaConflito');
const alertaConflitoTexto = document.querySelector('#alertaConflitoTexto');
const btnConfirmar = document.querySelector('#btnConfirmar');

/* MODAL DE DETALHES */
const modalDetalhes = document.querySelector('#modalDetalhes');
const detalheCliente = document.querySelector('#detalheCliente');
const detalheTelefone = document.querySelector('#detalheTelefone');
const detalheProfissional = document.querySelector('#detalheProfissional');
const detalheData = document.querySelector('#detalheData');
const detalheHorario = document.querySelector('#detalheHorario');
const detalheValor = document.querySelector('#detalheValor');
const detalheProcedimentos = document.querySelector('#detalheProcedimentos');
const detalheStatus = document.querySelector('#detalheStatus');
const detalheMotivoLinha = document.querySelector('#detalheMotivoLinha');
const detalheMotivo = document.querySelector('#detalheMotivo');
const btnCancelarAgendamento = document.querySelector('#btnCancelarAgendamento');

/* MODAL DE CANCELAMENTO */
const modalCancelar = document.querySelector('#modalCancelar');
const formCancelamento = document.querySelector('#formCancelamento');
const cancelarCliente = document.querySelector('#cancelarCliente');
const cancelarProfissional = document.querySelector('#cancelarProfissional');
const cancelarProcedimentos = document.querySelector('#cancelarProcedimentos');
const cancelarQuando = document.querySelector('#cancelarQuando');
const motivoInput = document.querySelector('#motivo');

let diaAtual = new Date();
diaAtual.setHours(0, 0, 0, 0);

let itensProcedimento = []; /* PROCEDIMENTOS ESCOLHIDOS NO MODAL, COM A QTD DE CADA UM */
let agendamentoAbertoId = null; /* AGENDAMENTO QUE ESTÁ NO MODAL DE DETALHES */

/* === 1. FUNÇÕES DE APOIO === */
function paraMinutos(horario) {
    const [h, m] = horario.split(':').map(Number);
    return h * 60 + m;
}

function paraHorario(minutos) {
    const h = String(Math.floor(minutos / 60)).padStart(2, '0');
    const m = String(minutos % 60).padStart(2, '0');
    return `${h}:${m}`;
}

function formatarDuracao(minutos) {
    return `${Math.floor(minutos / 60)}h${String(minutos % 60).padStart(2, '0')}`;
}

/* DATA NO FORMATO DO input date (2026-09-21). NÃO USAR toISOString: ELE CONVERTE PARA UTC E, À NOITE, PULA PARA O DIA SEGUINTE */
function paraDataISO(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

function deDataISO(texto) {
    const [ano, mes, dia] = texto.split('-').map(Number);
    return new Date(ano, mes - 1, dia);
}

/* 2026-09-22 -> 22/09/2026 */
function formatarDataBR(dataISO) {
    return dataISO.split('-').reverse().join('/');
}

function buscarPorId(chave, id) {
    return lerDados(chave).find(item => item.id === id);
}

/* === 2. GRADE === */
function renderizarAgenda() {
    const dia = String(diaAtual.getDate()).padStart(2, '0');
    const mes = String(diaAtual.getMonth() + 1).padStart(2, '0');
    tituloData.textContent = `${DIAS_SEMANA[diaAtual.getDay()]}, ${dia}/${mes}`;

    profissionaisCabecalho.replaceChildren();
    profissionaisColunas.replaceChildren();

    lerDados('profissionais').forEach(profissional => {
        const cabecalho = document.createElement('div');
        cabecalho.className = 'schedule__professional';
        cabecalho.textContent = profissional.nome;
        profissionaisCabecalho.append(cabecalho);

        const coluna = document.createElement('div');
        coluna.className = 'schedule__column';
        coluna.dataset.professional = profissional.id;
        profissionaisColunas.append(coluna);
    });

    const dataDaTela = paraDataISO(diaAtual);

    lerDados('agendamentos')
        .filter(agendamento => agendamento.data === dataDaTela)
        .forEach(desenharAgendamento);
}

function desenharAgendamento(agendamento) {
    const coluna = profissionaisColunas.querySelector(`[data-professional="${agendamento.profissionalId}"]`);
    if (!coluna) return; /* PROFISSIONAL FOI REMOVIDO */

    const cliente = buscarPorId('clientes', agendamento.clienteId);
    const inicio = paraMinutos(agendamento.hora);
    const bloco = agendamentoTemplate.content.cloneNode(true).firstElementChild;

    bloco.querySelector('.schedule__appointment-client').textContent = cliente ? cliente.nome : 'Cliente removido';
    bloco.querySelector('.schedule__appointment-time').textContent = `${agendamento.hora} – ${paraHorario(inicio + agendamento.duracao)}`;

    /* CADA LINHA DA GRADE É 1 MINUTO A PARTIR DAS 07:00 */
    bloco.style.gridRow = `${inicio - INICIO_EXPEDIENTE + 1} / span ${agendamento.duracao}`;

    if (agendamento.status === 'cancelado') {
        bloco.classList.add('schedule__appointment--canceled');
    }

    bloco.addEventListener('click', () => abrirDetalhes(agendamento));
    coluna.append(bloco);
}

function mudarDia(dias) {
    diaAtual.setDate(diaAtual.getDate() + dias);
    renderizarAgenda();
}

/* === 3. MODAL DE NOVO AGENDAMENTO === */
function preencherModal() {
    lerDados('clientes')
        .sort((a, b) => a.nome.localeCompare(b.nome))
        .forEach(cliente => clienteSelect.append(new Option(cliente.nome, cliente.id)));

    lerDados('profissionais')
        .forEach(profissional => profissionalSelect.append(new Option(profissional.nome, profissional.id)));

    lerDados('procedimentos').forEach(procedimento => {
        const texto = `${procedimento.nome} · ${procedimento.duracao} min · ${formatarValor(procedimento.valor)}`;
        procedimentoSelect.append(new Option(texto, procedimento.id));
    });
}

/* CADA PROCEDIMENTO ESCOLHIDO NO SELECT VIRA UMA LINHA NA LISTA, COM QTD E BOTÃO DE REMOVER */
function adicionarProcedimento() {
    const opcao = procedimentoSelect.selectedOptions[0];
    const procedimento = buscarPorId('procedimentos', Number(opcao.value));
    const linha = procedimentoTemplate.content.cloneNode(true).firstElementChild;
    const item = { procedimento, opcao, qtdInput: linha.querySelector('.modal__qty-input') };

    linha.querySelector('.modal__procedure-text').textContent = opcao.text;
    linha.querySelector('.modal__remove').addEventListener('click', () => {
        linha.remove();
        opcao.disabled = false;
        itensProcedimento = itensProcedimento.filter(outro => outro !== item);
        atualizarFormulario();
    });

    procedimentosLista.append(linha);
    itensProcedimento.push(item);

    opcao.disabled = true; /* O MESMO PROCEDIMENTO NÃO ENTRA DUAS VEZES: PARA ISSO EXISTE A QTD */
    procedimentoSelect.value = '';
    atualizarFormulario();
}

function procedimentosSelecionados() {
    return itensProcedimento
        .map(item => ({ procedimento: item.procedimento, qtd: Number(item.qtdInput.value) || 1 }));
}

function calcularTotais(selecionados) {
    return {
        duracao: selecionados.reduce((total, item) => total + item.procedimento.duracao * item.qtd, 0),
        valor: selecionados.reduce((total, item) => total + item.procedimento.valor * item.qtd, 0)
    };
}

/* RODA A CADA MUDANÇA NO FORM: ATUALIZA O RESUMO E CONFERE AS REGRAS */
function atualizarFormulario() {
    const selecionados = procedimentosSelecionados();
    const { duracao, valor } = calcularTotais(selecionados);

    resumoDuracao.textContent = formatarDuracao(duracao);
    resumoValor.textContent = formatarValor(valor);
    resumoIntervalo.textContent = '';
    horaInput.setCustomValidity('');
    alertaConflito.hidden = true;
    btnConfirmar.disabled = false;

    /* PELO MENOS UM PROCEDIMENTO. O AVISO APARECE NO SELECT */
    procedimentoSelect.setCustomValidity(selecionados.length ? '' : 'Selecione pelo menos um procedimento.');

    /* O RESTO SÓ DÁ PRA CONFERIR COM HORÁRIO E PROCEDIMENTO ESCOLHIDOS */
    if (!horaInput.value || duracao === 0) return;

    const inicio = paraMinutos(horaInput.value);
    const fim = inicio + duracao;
    resumoIntervalo.textContent = `(${horaInput.value} → ${paraHorario(fim)})`;

    /* PRECISA TERMINAR ATÉ AS 18:00 */
    if (fim > FIM_EXPEDIENTE) {
        horaInput.setCustomValidity(`Com esses procedimentos, o último horário possível é ${paraHorario(FIM_EXPEDIENTE - duracao)}.`);
    }

    /* CONFLITO: MESMO PROFISSIONAL, MESMO DIA E HORÁRIOS QUE SE CRUZAM */
    if (!profissionalSelect.value || !dataInput.value) return;

    const conflito = lerDados('agendamentos').find(agendamento => {
        const outroInicio = paraMinutos(agendamento.hora);
        const outroFim = outroInicio + agendamento.duracao;

        return agendamento.status !== 'cancelado'
            && agendamento.profissionalId === Number(profissionalSelect.value)
            && agendamento.data === dataInput.value
            && inicio < outroFim
            && outroInicio < fim;
    });

    if (conflito) {
        const conflitoFim = paraHorario(paraMinutos(conflito.hora) + conflito.duracao);
        alertaConflitoTexto.textContent =
            `${profissionalSelect.selectedOptions[0].text} já tem agendamento das ${conflito.hora} às ${conflitoFim}. Escolha outro horário ou profissional.`;
        alertaConflito.hidden = false;
        btnConfirmar.disabled = true;
    }
}

/* DEIXA O FORM LIMPO E COM A DATA DO DIA QUE ESTÁ NA TELA */
function limparFormulario() {
    formAgendamento.reset();
    itensProcedimento.forEach(item => {
        item.opcao.disabled = false;
    });
    itensProcedimento = [];
    procedimentosLista.replaceChildren();
    dataInput.value = paraDataISO(diaAtual);
    atualizarFormulario();
}

/* SÓ CHEGA AQUI SE TUDO ESTIVER VÁLIDO. DEPOIS DISSO O method="dialog" FECHA O MODAL */
formAgendamento.addEventListener('submit', () => {
    const selecionados = procedimentosSelecionados();
    const { duracao, valor } = calcularTotais(selecionados);
    const agendamentos = lerDados('agendamentos');

    agendamentos.push({
        id: gerarId(agendamentos),
        clienteId: Number(clienteSelect.value),
        profissionalId: Number(profissionalSelect.value),
        procedimentos: selecionados.map(item => ({ id: item.procedimento.id, qtd: item.qtd })),
        data: dataInput.value,
        hora: horaInput.value,
        duracao,
        valor,
        status: 'agendado'
    });

    salvarDados('agendamentos', agendamentos);

    /* MOSTRA O DIA DO AGENDAMENTO QUE ACABOU DE SER CRIADO */
    diaAtual = deDataISO(dataInput.value);
    renderizarAgenda();
});

/* === 4. MODAL DE DETALHES === */
function abrirDetalhes(agendamento) {
    const cliente = buscarPorId('clientes', agendamento.clienteId);
    const profissional = buscarPorId('profissionais', agendamento.profissionalId);
    const procedimentos = lerDados('procedimentos');
    const fim = paraHorario(paraMinutos(agendamento.hora) + agendamento.duracao);

    detalheCliente.textContent = cliente ? cliente.nome : 'Cliente removido';
    detalheTelefone.textContent = cliente ? cliente.telefone : '—';
    detalheProfissional.textContent = profissional ? profissional.nome : 'Profissional removido';
    detalheData.textContent = agendamento.data.split('-').reverse().join('/');
    detalheHorario.textContent = `${agendamento.hora} → ${fim} (${formatarDuracao(agendamento.duracao)})`;
    detalheValor.textContent = formatarValor(agendamento.valor);
    detalheProcedimentos.textContent = agendamento.procedimentos
        .map(item => {
            const procedimento = procedimentos.find(p => p.id === item.id);
            return `${procedimento ? procedimento.nome : 'Procedimento removido'} (x${item.qtd})`;
        })
        .join(', ');
    detalheStatus.textContent = agendamento.status === 'cancelado' ? 'Cancelado' : 'Agendado';

          /* O MOTIVO SÓ APARECE EM AGENDAMENTO CANCELADO QUE TENHA MOTIVO PREENCHIDO */
    detalheMotivoLinha.hidden = !agendamento.motivoCancelamento;
    detalheMotivo.textContent = agendamento.motivoCancelamento || '';

    btnCancelarAgendamento.hidden = agendamento.status === 'cancelado';
    agendamentoAbertoId = agendamento.id;
    modalDetalhes.showModal();
}

/* === 5. MODAL DE CANCELAMENTO === */
/* "Limpeza de pele + Peeling". A QTD SÓ APARECE QUANDO É MAIOR QUE 1 */
function resumirProcedimentos(agendamento) {
    const procedimentos = lerDados('procedimentos');

    return agendamento.procedimentos
        .map(item => {
            const procedimento = procedimentos.find(p => p.id === item.id);
            const nome = procedimento ? procedimento.nome : 'Procedimento removido';
            return item.qtd > 1 ? `${nome} (x${item.qtd})` : nome;
        })
        .join(' + ');
}

/* TROCA O MODAL DE DETALHES PELO DE CONFIRMAÇÃO, JÁ COM O RESUMO DO AGENDAMENTO */
function abrirCancelamento() {
    const agendamento = buscarPorId('agendamentos', agendamentoAbertoId);
    const cliente = buscarPorId('clientes', agendamento.clienteId);
    const profissional = buscarPorId('profissionais', agendamento.profissionalId);
    const fim = paraHorario(paraMinutos(agendamento.hora) + agendamento.duracao);
    const diaSemana = DIAS_ABREVIADOS[deDataISO(agendamento.data).getDay()];

    cancelarCliente.textContent = cliente ? cliente.nome : 'Cliente removido';
    cancelarProfissional.textContent = profissional ? profissional.nome : 'Profissional removido';
    cancelarProcedimentos.textContent = `${resumirProcedimentos(agendamento)} · ${formatarDuracao(agendamento.duracao)}`;
    cancelarQuando.textContent =
        `${diaSemana}, ${formatarDataBR(agendamento.data)} · ${agendamento.hora} às ${fim} · ${formatarValor(agendamento.valor)}`;

    formCancelamento.reset(); /* LIMPA O MOTIVO DE UM CANCELAMENTO ANTERIOR */
    modalDetalhes.close();
    modalCancelar.showModal();
}

/* O method="dialog" FECHA O MODAL DEPOIS DESTE SUBMIT */
formCancelamento.addEventListener('submit', () => {
    const agendamentos = lerDados('agendamentos');
    const agendamento = agendamentos.find(item => item.id === agendamentoAbertoId);

    agendamento.status = 'cancelado';
    agendamento.motivoCancelamento = motivoInput.value.trim();

    salvarDados('agendamentos', agendamentos);
    renderizarAgenda(); /* O BLOCO FICA RISCADO E O HORÁRIO LIBERA PARA NOVOS AGENDAMENTOS */
});

btnCancelarAgendamento.addEventListener('click', abrirCancelamento);

/* === 6. INÍCIO === */
diaAnterior.addEventListener('click', () => mudarDia(-1));
diaSeguinte.addEventListener('click', () => mudarDia(1));
btnNovoAgendamento.addEventListener('click', limparFormulario);
procedimentoSelect.addEventListener('change', adicionarProcedimento);
formAgendamento.addEventListener('input', atualizarFormulario);

preencherModal();
renderizarAgenda();