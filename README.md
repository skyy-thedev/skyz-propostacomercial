# 🚀 Sistema de Automação de Propostas Comerciais

## Skyz Design BR

Sistema web profissional para automação da criação de propostas comerciais personalizadas. Desenvolvido para maximizar a taxa de conversão através de propostas altamente personalizadas e profissionais.

![Skyz Design BR](https://img.shields.io/badge/Skyz_Design_BR-0066FF?style=for-the-badge&logo=instagram&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-como-usar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Personalização](#-personalização)
- [Deploy](#-deploy)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

Este sistema foi desenvolvido para automatizar a criação de propostas comerciais da **Skyz Design BR** ([@skyzdesignbr](https://instagram.com/skyzdesignbr)), empresa especializada em design e desenvolvimento de software.

### Objetivo

Capturar informações estratégicas do cliente através de um formulário inteligente e gerar propostas comerciais altamente personalizadas e profissionais em PDF e DOCX.

---

## ✨ Funcionalidades

### ✅ Implementadas

- [x] **Formulário Multi-Etapas** - 5 etapas com validação em tempo real
- [x] **Auto-Save** - Dados salvos automaticamente no localStorage
- [x] **Geração de PDF** - Documento profissional com design moderno
- [x] **Geração de DOCX** - Documento editável para ajustes
- [x] **Personalização Dinâmica** - Conteúdo adaptado às respostas do cliente
- [x] **Sistema de Pacotes** - Geração automática baseada no orçamento
- [x] **Design Responsivo** - Funciona em desktop, tablet e mobile
- [x] **Animações Suaves** - Transições elegantes com Framer Motion
- [x] **Validação Robusta** - Schemas Zod para validação de dados

### 🔄 Planejadas (Futuras)

- [ ] Dashboard Administrativo
- [ ] Envio automático por e-mail
- [ ] Integração com WhatsApp Business
- [ ] Assinatura digital
- [ ] Analytics de propostas (abertura/visualização)
- [ ] CRM básico integrado
- [ ] Múltiplos templates de proposta

---

## 🛠 Tecnologias Utilizadas

### Frontend
- **[Next.js 14](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilização utilitária
- **[Framer Motion](https://www.framer.com/motion/)** - Animações
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários
- **[Zod](https://zod.dev/)** - Validação de schemas
- **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis
- **[Lucide React](https://lucide.dev/)** - Ícones

### Geração de Documentos
- **[jsPDF](https://github.com/parallax/jsPDF)** - Geração de PDF
- **[jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable)** - Tabelas em PDF
- **[docx](https://github.com/dolanmiu/docx)** - Geração de DOCX

### Utilitários
- **[file-saver](https://github.com/eligrey/FileSaver.js/)** - Download de arquivos
- **[clsx](https://github.com/lukeed/clsx)** - Classes condicionais
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Merge de classes Tailwind

---

## 📦 Pré-requisitos

- **Node.js** 18.17 ou superior
- **npm** 9+ ou **yarn** 1.22+ ou **pnpm** 8+
- **Git** (para clonar o repositório)

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/proposta-comercial-skyz.git
cd proposta-comercial-skyz
```

### 2. Instale as dependências

```bash
# Com npm
npm install

# Com yarn
yarn install

# Com pnpm
pnpm install
```

### 3. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite conforme necessário
```

### 4. Execute o servidor de desenvolvimento

```bash
# Com npm
npm run dev

# Com yarn
yarn dev

# Com pnpm
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `NEXT_PUBLIC_APP_URL` | URL base da aplicação | Não |
| `EMAIL_PROVIDER` | Provedor de e-mail (resend, sendgrid) | Não |
| `RESEND_API_KEY` | API Key do Resend | Não |
| `AWS_S3_BUCKET` | Bucket S3 para armazenamento | Não |

Consulte `.env.example` para todas as opções disponíveis.

### Personalizando a Identidade Visual

Edite o arquivo `src/lib/config/company-content.ts`:

```typescript
export const COMPANY_INFO = {
  name: "Sua Empresa",
  instagram: "@suaempresa",
  email: "contato@suaempresa.com.br",
  phone: "(11) 99999-9999",
  // ...
};
```

### Alterando Cores

Edite `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    DEFAULT: "#SuaCor",
    // ...
  },
}
```

---

## 💻 Como Usar

### 1. Acessar o Formulário
- Acesse a página inicial
- O formulário de proposta será exibido

### 2. Preencher as 5 Etapas
1. **Dados do Cliente** - Informações de contato
2. **Diagnóstico** - Desafios e dores do cliente
3. **Solução Desejada** - Objetivos e expectativas
4. **Informações Comerciais** - Orçamento e decisão
5. **Próximos Passos** - Follow-up e preferências

### 3. Gerar a Proposta
- Clique em "Gerar Proposta"
- Aguarde a geração do documento
- Escolha o formato (PDF ou DOCX)
- Faça o download

---

## 📁 Estrutura do Projeto

```
src/
├── app/                      # App Router do Next.js
│   ├── api/
│   │   └── generate-proposal/
│   │       └── route.ts      # API de geração de propostas
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Página inicial
├── components/
│   ├── forms/                # Componentes do formulário
│   │   ├── FormProgress.tsx
│   │   ├── FormStepWrapper.tsx
│   │   ├── MultiStepForm.tsx
│   │   ├── Step1ClientData.tsx
│   │   ├── Step2Diagnosis.tsx
│   │   ├── Step3Solution.tsx
│   │   ├── Step4Commercial.tsx
│   │   ├── Step5NextSteps.tsx
│   │   └── index.ts
│   └── ui/                   # Componentes de UI reutilizáveis
│       ├── Button.tsx
│       ├── Checkbox.tsx
│       ├── Input.tsx
│       ├── Progress.tsx
│       ├── RadioGroup.tsx
│       ├── Select.tsx
│       ├── Textarea.tsx
│       └── index.ts
├── lib/
│   ├── config/
│   │   └── company-content.ts # Conteúdo da empresa
│   ├── generators/
│   │   ├── generateDOCX.ts   # Gerador de DOCX
│   │   ├── generatePDF.ts    # Gerador de PDF
│   │   ├── packageGenerator.ts # Gerador de pacotes
│   │   └── index.ts
│   ├── utils.ts              # Funções utilitárias
│   └── validationSchemas.ts  # Schemas de validação
├── styles/
│   └── globals.css           # Estilos globais
└── types/
    └── proposal.types.ts     # Tipos TypeScript
```

---

## 🎨 Personalização

### Modificar Conteúdo da Empresa

Arquivo: `src/lib/config/company-content.ts`

- `COMPANY_INFO` - Dados de contato
- `COMPANY_ABOUT` - Textos sobre a empresa
- `COMPANY_DIFFERENTIALS` - Diferenciais
- `TECHNOLOGIES` - Stack tecnológico
- `TESTIMONIALS` - Depoimentos de clientes
- `SERVICE_PACKAGES` - Templates de pacotes
- `TERMS_AND_CONDITIONS` - Termos e condições

### Adicionar Novos Campos ao Formulário

1. Adicione o campo no schema em `validationSchemas.ts`
2. Atualize o componente de step correspondente
3. Ajuste os geradores de PDF/DOCX se necessário

### Modificar Templates de Proposta

Edite os arquivos:
- `src/lib/generators/generatePDF.ts`
- `src/lib/generators/generateDOCX.ts`

---

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

```bash
# Ou use a CLI
npm i -g vercel
vercel
```

### Outras Plataformas

O projeto é compatível com:
- **Netlify**
- **Railway**
- **Render**
- **AWS Amplify**
- **DigitalOcean App Platform**

### Build de Produção

```bash
npm run build
npm start
```

---

## 🧪 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Inicia servidor de produção |
| `npm run lint` | Verifica código com ESLint |

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona NovaFeature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

## 📝 Roadmap

### Versão 1.1
- [ ] Dashboard de administração
- [ ] Histórico de propostas
- [ ] Estatísticas básicas

### Versão 1.2
- [ ] Integração com e-mail
- [ ] Templates múltiplos
- [ ] Assinatura digital

### Versão 2.0
- [ ] CRM integrado
- [ ] WhatsApp Business API
- [ ] Multi-usuários

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👤 Autor

**Skyz Design BR**

- Instagram: [@skyzdesignbr](https://instagram.com/skyzdesignbr)
- Website: [skyzdesign.com.br](https://skyzdesign.com.br)

---

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - O framework React para produção
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
- [Vercel](https://vercel.com/) - Plataforma de deploy

---

<p align="center">
  Feito com ❤️ por <a href="https://instagram.com/skyzdesignbr">Skyz Design BR</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Transforme_sua_visão_em_realidade_digital-0066FF?style=for-the-badge" alt="Slogan">
</p>
