# VitaSync

Sistema de agendamento para clínicas, feito para a recepção organizar clientes, profissionais, procedimentos e horários em um só lugar.

Projeto desenvolvido para o Projeto Interdisciplinar do curso de Análise e Desenvolvimento de Sistemas (ADS).

## Funcionalidades

- **Login:** acesso da recepção, com opção de lembrar o acesso.
- **Agenda:** visão do dia com uma coluna por profissional, das 07:00 às 18:00.
- **Agendamentos:** escolha de cliente, profissional e um ou mais procedimentos, com quantidade, duração e valor calculados automaticamente.
- **Regras da agenda:** bloqueia horários em conflito para o mesmo profissional e atendimentos que terminariam depois das 18:00.
- **Cancelamento:** detalhes do agendamento e cancelamento com motivo.
- **Clientes:** cadastro, listagem e busca por nome ou CPF, sem CPF repetido.
- **Profissionais:** cadastro com registro, especialidade e procedimentos realizados, além da lista de cadastrados.
- **Procedimentos:** cadastro com duração, preço e descrição, além da lista de cadastrados.

## Tecnologias

- HTML5
- CSS3 (padrão BEM)
- JavaScript puro
- `localStorage` e `sessionStorage` para guardar os dados no navegador

O projeto não usa frameworks, back-end nem banco de dados.


## Tecnologias

- HTML5
- CSS3 (padrão BEM)
- JavaScript puro
- `localStorage` e `sessionStorage` para guardar os dados no navegador

O projeto não usa frameworks, back-end nem banco de dados.

## Como executar

1. Clone o repositório:

   ```bash
   git clone https://github.com/joaocortonezi/VitaSyncProjeto.git
   ```

2. Abra a pasta do projeto no VS Code.
3. Com a extensão **Live Server** instalada, clique com o botão direito no `index.html` e escolha **Open with Live Server** ou acesse o link do projeto no Github Pages: https://joaocortonezi.github.io/VitaSyncProjeto/

### Acesso de teste

| E-mail | Senha |
|---|---|
| recepcao@vitasync.com | 123456 |

## Estrutura do projeto

```text
VitaSyncProjeto/
├── index.html           # Tela de login
├── pages/
│   ├── schedule.html    # Agenda
│   ├── clients.html     # Clientes
│   ├── professionals.html
│   └── procedures.html
└── assets/
    ├── css/             # style.css (geral) e um arquivo por página
    └── js/              # scripts.js (funções compartilhadas) e um arquivo por página
```

## Limitações

- Os dados ficam salvos apenas no navegador usado. Eles não são compartilhados entre computadores e somem se os dados do site forem apagados.
- O login é fixo e serve apenas para demonstração.
- A visualização por semana da agenda e o link "Esqueceu a senha?" ainda não funcionam.

## Equipe

- João Gabriel Catani Cortonezi
- Camily Vitoria Rezende Frasson