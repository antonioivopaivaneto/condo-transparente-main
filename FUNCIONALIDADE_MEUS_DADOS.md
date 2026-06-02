# 📋 Funcionalidade de Exclusão de Dados Pessoais - LGPD

## 📍 O que foi implementado

Sistema completo de gerenciamento de dados pessoais de acordo com a **LGPD (Lei Geral de Proteção de Dados)**, com opções para:
- ✅ Visualizar dados pessoais
- ✅ Exportar dados em JSON
- ✅ Deletar conta e dados permanentemente

---

## 🎯 Componentes Criados

### 1. **Página "Meus Dados"** ([src/pages/MyData.tsx](src/pages/MyData.tsx))

Página completa de gerenciamento de dados com:

#### **Seções da Página:**

**📌 Informações Pessoais**
- Email
- ID do usuário
- Data de cadastro
- Status de autenticação 2FA

**🔒 Segurança**
- Tentativas de login falhadas
- Última tentativa falha
- Status de bloqueio de conta

**📝 Consentimentos**
- Histórico de consentimentos
- Versão de cada termo
- Status de aceito/rejeitado

**🛠️ Gerenciar Dados Pessoais**
- **Botão Exportar**: Baixa todos os dados em JSON
- **Botão Deletar Conta**: Delete permanentemente (com confirmação)

---

## 📱 Integração na Navbar

### **Desktop (Menu Dropdown)**
```
👤 [Síndico/Morador] ▼
├─ Meus Dados
├─ ────────────
└─ Sair
```

### **Mobile (Menu Hambúrguer)**
```
☰ Menu
├─ 👤 Meus Dados
└─ Sair
```

---

## 🔄 Fluxo de Funcionamento

### **1. Exportar Dados**
```
Usuario clica "Exportar"
         ↓
POST /api/auth/export-data
         ↓
Backend gera token + link
         ↓
Email enviado com link
         ↓
Download em 24h
```

### **2. Deletar Conta**
```
Usuario clica "Deletar Conta"
         ↓
Diálogo com confirmação
         ↓
Digita senha
         ↓
POST /api/auth/delete-account + password
         ↓
Backend verifica senha
         ↓
Gera token de confirmação
         ↓
Email enviado com link
         ↓
Usuario clica no link
         ↓
Conta deletada permanentemente
```

---

## 🛣️ Rotas Adicionadas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/my-data` | MyData.tsx | Página de gerenciamento de dados |

---

## 📡 APIs Utilizadas (Backend)

| Endpoint | Método | Função |
|----------|--------|--------|
| `/api/auth/my-data` | GET | Retorna dados do usuário |
| `/api/auth/export-data` | POST | Gera link de exportação |
| `/api/auth/delete-account` | POST | Solicita exclusão da conta |

---

## 🔐 Segurança Implementada

### **Exportação de Dados**
- ✅ Token único gerado
- ✅ Expira em 24 horas
- ✅ Confirmação por email
- ✅ Arquivo em formato JSON

### **Exclusão de Conta**
- ✅ Requer senha válida
- ✅ Email de confirmação obrigatório
- ✅ Token com expiração de 15 minutos
- ✅ Confirmação por link único
- ✅ Irreversível (dados deletados permanentemente)
- ✅ Logout automático após deleção

---

## 📋 Dados Visualizados pelo Usuário

### **Perfil**
```json
{
  "profile": {
    "id": "uuid",
    "email": "user@example.com",
    "createdAt": "2026-06-01T10:00:00.000Z",
    "updatedAt": "2026-06-01T10:00:00.000Z",
    "twoFactorEnabled": false
  }
}
```

### **Segurança**
```json
{
  "security": {
    "failedAttempts": 0,
    "lockUntil": null,
    "lastFailedLoginAt": null
  }
}
```

### **Consentimentos**
```json
{
  "consents": [
    {
      "type": "MARKETING",
      "version": "1.0",
      "accepted": true,
      "acceptedAt": "2026-06-01T10:00:00.000Z",
      "revokedAt": null
    }
  ]
}
```

---

## 🎨 Interface do Usuário

### **Card de Informações Pessoais**
- Gradeado com 2 colunas
- Informações em leitura
- Sem possibilidade de edição

### **Dialog de Confirmação (Deletar)**
- ⚠️ Aviso em vermelho
- Lista de consequências
- Campo de senha obrigatório
- Botões de Cancelar e Deletar

### **Estados de Carregamento**
- Spinner durante exportação
- Spinner durante exclusão
- Desabilitar botões durante ação
- Toast notifications

---

## 📚 Uso

### **Para o Usuário:**

1. **Acessar Meus Dados:**
   - Fazer login
   - Clica no menu superior (👤 Síndico/Morador)
   - Seleciona "Meus Dados"

2. **Exportar Dados:**
   - Na página "Meus Dados"
   - Clica em "Exportar"
   - Recebe link por email
   - Download automático em nova aba

3. **Deletar Conta:**
   - Na página "Meus Dados"
   - Clica em "Deletar Conta"
   - Confirma com sua senha
   - Clica no link enviado por email
   - Conta deletada

---

## ✅ Conformidade

- ✅ **LGPD Art. 18** - Direito de acesso aos dados
- ✅ **LGPD Art. 19** - Direito de exportação de dados
- ✅ **LGPD Art. 17** - Direito ao esquecimento (exclusão)
- ✅ **Confirmação por email** - Dupla confirmação
- ✅ **Logs de auditoria** - Histórico de ações

---

## 🚀 Próximas Melhorias (Opcional)

1. **Download Automático** - Já abre download ao clicar
2. **Criptografia de Dados** - Exportar com senha
3. **Relatório de Conformidade** - Gerar PDF com dados
4. **Agenda Automática** - Deletar após 30 dias
5. **Recuperação de Dados** - Window de 7 dias para recuperar

---

**Implementação concluída! ✅**
