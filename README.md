# BRS Academy

Esta é uma aplicação Next.js para a plataforma de e-learning BRS Academy, desenvolvida com o auxílio do Firebase Studio.

## Visão Geral da Tecnologia

- **Framework:** Next.js (com App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS com componentes ShadCN UI
- **Funcionalidades de IA:** Google AI via Genkit
- **Banco de Dados (Simulado):** Dados locais em `src/lib/mock-data.ts`

## Pré-requisitos

- Node.js (versão 20 ou superior)
- npm

## Como Executar o Projeto Localmente

Este projeto está configurado para funcionar com dados simulados locais, então nenhum serviço externo (como Firebase) é necessário para a operação básica.

### 1. Instale as Dependências

Na raiz do projeto, execute o seguinte comando para instalar todos os pacotes necessários:

```bash
npm install
```

### 2. Configure as Variáveis de Ambiente

Crie uma cópia do arquivo `.env.example` (se existir) ou crie um novo arquivo chamado `.env` na raiz do projeto. Para as funcionalidades de IA, você precisará de chaves de API do Google.

```.env
# Chave da API do Google para as funcionalidades de IA (Genkit)
GOOGLE_API_KEY="SUA_CHAVE_DE_API_DO_GOOGLE_AQUI"

# Chave da API do YouTube para buscar detalhes de vídeos
YOUTUBE_API_KEY="SUA_CHAVE_DE_API_DO_YOUTUBE_AQUI"
```

### 3. Execute os Servidores de Desenvolvimento

Para uma experiência de desenvolvimento completa, você precisará executar dois servidores simultaneamente em terminais separados.

#### Terminal 1: Iniciar a Aplicação Next.js

```bash
npm run dev
```

Abra [http://localhost:9003](http://localhost:9003) no seu navegador para ver a aplicação.

#### Terminal 2: Iniciar o Servidor Genkit (para IA)

Para que as funcionalidades de IA (como o gerador de questionários) funcionem, execute o servidor Genkit:

```bash
npm run genkit:watch
```

Este comando irá iniciar o servidor de IA e observará as alterações nos arquivos de fluxo.

---

Com essas instruções, o projeto está pronto para ser versionado e compartilhado.
