# China Business Experience — Landing page

Imersão de negócios na China (Canton Fair). Site estático (HTML/CSS/JS), com formulário de
avaliação de perfil gravando no **Supabase**, hospedado de graça no **Cloudflare Pages** via **GitHub**.

## Arquivos
- `index.html` — site principal (versão premium)
- `premium.html` / `classico.html` — versões alternativas
- `guia-canton-fair.html` — guia em PDF (cortesia)
- `config.js` — credenciais do Supabase (preencher)
- `supabase.sql` — script da tabela de candidaturas
- `img/` — imagens

## Rodar localmente
```
python3 -m http.server 8123
# abra http://localhost:8123
```

---

## Passo a passo para publicar

### 1) Supabase (banco de dados)
1. Crie conta em https://supabase.com e clique em **New project** (escolha região mais próxima, ex.: South America).
2. Vá em **SQL Editor > New query**, cole o conteúdo de `supabase.sql` e clique em **Run**.
3. Vá em **Project Settings > API** e copie:
   - **Project URL** (ex.: `https://xxxx.supabase.co`)
   - **anon public key**
4. Cole os dois valores no arquivo `config.js`.

### 2) GitHub (código)
1. Crie conta em https://github.com e um repositório novo (ex.: `china-business-experience`).
2. Na pasta do projeto, rode (já com o repositório criado):
```
git remote add origin https://github.com/SEU_USUARIO/china-business-experience.git
git branch -M main
git push -u origin main
```

### 3) Cloudflare Pages (hospedagem)
1. Crie conta em https://cloudflare.com e vá em **Workers & Pages > Create > Pages > Connect to Git**.
2. Selecione o repositório do GitHub.
3. Build settings: **Framework preset = None**, **Build command = (vazio)**, **Output directory = /** (raiz).
4. Clique em **Save and Deploy**. Em ~1 min o site fica no ar (ex.: `china-business-experience.pages.dev`).
5. Para domínio próprio: **Custom domains** dentro do projeto Pages.

A cada `git push`, o Cloudflare republica automaticamente.

### Ver as candidaturas
No painel do Supabase: **Table Editor > candidaturas**.
