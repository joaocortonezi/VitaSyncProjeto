/* === CLIENTES === */
exigirLogin();

const clienteForm = document.querySelector('#clienteForm');
const buscaInput = document.querySelector('#busca');
const clientesTabela = document.querySelector('#clientesTabela');
const nomeInput = document.querySelector('#nome');
const cpfInput = document.querySelector('#cpf');
const telefoneInput = document.querySelector('#telefone');
const cpfError = document.querySelector('#cpfError');

/* === 1. MÁSCARAS === */
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

cpfInput.addEventListener('input', () => {
    cpfInput.value = mascaraCpf(cpfInput.value);
    cpfInput.setCustomValidity(cpfInput.value.length === 14 ? '' : 'Digite o CPF completo.');
    cpfError.hidden = true;
});

telefoneInput.addEventListener('input', () => {
    telefoneInput.value = mascaraTelefone(telefoneInput.value);
    telefoneInput.setCustomValidity(telefoneInput.value.length === 16 ? '' : 'Digite o telefone completo.');
});

/* === 2. LISTA === */
function renderizarClientes() {
    const termo = buscaInput.value.trim().toLowerCase();
    const termoNumeros = termo.replace(/\D/g, '');

    const clientes = lerDados('clientes')
        .filter(cliente =>
            cliente.nome.toLowerCase().includes(termo) ||
            (termoNumeros && cliente.cpf.replace(/\D/g, '').includes(termoNumeros))
        )
        .sort((a, b) => a.nome.localeCompare(b.nome));

    clientesTabela.replaceChildren(); /* LIMPA A TABELA ANTES DE DESENHAR DE NOVO */

    if (clientes.length === 0) {
        const linha = clientesTabela.insertRow();
        const celula = linha.insertCell();
        celula.colSpan = 3;
        celula.textContent = termo ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado';
        return;
    }

    clientes.forEach(cliente => {
        const linha = clientesTabela.insertRow();
        linha.insertCell().textContent = cliente.nome;
        linha.insertCell().textContent = cliente.cpf;
        linha.insertCell().textContent = cliente.telefone;
    });
}

buscaInput.addEventListener('input', renderizarClientes);

/* === 3. CADASTRO === */
clienteForm.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const clientes = lerDados('clientes');

    /* CHECAGEM ANTES DE SALVAR: CPF REPETIDO NÃO ENTRA */
    if (clientes.some(cliente => cliente.cpf === cpfInput.value)) {
        cpfError.hidden = false;
        return;
    }

    clientes.push({
        id: gerarId(clientes),
        nome: nomeInput.value.trim(),
        cpf: cpfInput.value,
        telefone: telefoneInput.value
    });

    salvarDados('clientes', clientes);
    clienteForm.reset();
    renderizarClientes();
});

/* "CANCELAR" LIMPA O FORM E ESCONDE O AVISO */
clienteForm.addEventListener('reset', () => {
    cpfError.hidden = true;
});

renderizarClientes();