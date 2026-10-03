# Joaquim Neto — portfólio com seis projetos

Site estático em HTML, CSS e JavaScript, baseado na versão do portfólio publicada em `jn-hazel.vercel.app`. A galeria é a única seção de projetos e usa Three.js para explorar seis trabalhos em painéis interativos: Ricardo Lara, Exercícios de Front-end, Peixaria Dinho, Portal Acácio Piedade, Chatbot com IA e Geo Mundo. O painel de detalhes reúne descrição, tecnologias e link externo; no Portal, cinco prévias incluem entrada e recuperação de senha. GSAP cuida das transições; sem WebGL, no celular abaixo de 700 px ou com movimento reduzido, uma imagem de prévia e os controles continuam disponíveis. A seção Tecnologias tem um carrossel automático de logos com pausa manual, pausa ao passar o cursor e respeito à preferência por movimento reduzido.

## Publicar na Vercel

O projeto completo está nesta pasta. Copie `public/` e `vercel.json` para a raiz do repositório conectado à Vercel, substituindo os arquivos correspondentes. A configuração aponta `outputDirectory` para `public` e dispensa build. Faça um commit e confira a URL de preview antes de promover à produção.

Se a raiz configurada no projeto Vercel for outra pasta, coloque esses arquivos nessa pasta ou ajuste a configuração do projeto para apontar para a raiz deste pacote.

## Arquivos

- `public/index.html`: estrutura, conteúdo, links e controles da galeria.
- `public/styles.css`: layout, estados responsivos e visual.
- `public/showcase.js`: seleção de projetos e galeria Three.js com fallback.
- `public/skills.js`: repetição visual do carrossel de tecnologias e controle de pausa.
- `public/background.js`: animação de fundo existente.
- `public/motion.js`: animações GSAP, com revelação nativa por rolagem se ScrollTrigger não estiver disponível.
- `public/script.js`: WhatsApp, contador de palavras e cópia do e-mail.
- `public/assets/` e `public/vendor/`: capturas dos projetos, logos de tecnologia e bibliotecas locais.

Para servir localmente a partir desta pasta: `python -m http.server 8000 --directory public`. A galeria usa módulos JavaScript, portanto deve ser aberta pelo servidor e não por `file://`.

O Chatbot com IA continua identificado como projeto hipotético e independente, sem relação oficial com a Binho Celulares. O projeto Exercícios de Front-end substitui o Estoque Binho. O contato mantém a rota por WhatsApp da versão atual.

Os ícones SVG em `public/assets/tech/` vieram do projeto Devicon (licença MIT em `public/assets/tech/LICENSE.txt`). SQL, GSAP e Power BI usam marcas tipográficas no carrossel.
