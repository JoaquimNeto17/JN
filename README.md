# Joaquim Neto — portfólio

Página pessoal em HTML, CSS e JavaScript. Paleta verde floresta, sálvia e cobre, com fundo animado de linhas topográficas em Three.js. Apresenta três projetos: Portal Acácio Piedade, Chatbot com IA e Geo Mundo.

## Publicação na Vercel

A pasta `public` contém todos os arquivos do site. O arquivo `vercel.json` configura o diretório de saída como `public`, sem etapa de compilação. Para atualizar um projeto ligado ao GitHub, coloque `public`, `vercel.json` e este README no diretório raiz configurado na Vercel e faça o commit. Confira o preview antes de promover à produção.

Para testar localmente, execute `python -m http.server 8000 --directory public` e acesse `http://localhost:8000`.

## Capturas do Portal

O carrossel utiliza cinco capturas, começando por formação de palavras, números e seleção de atividades; a entrada no portal e a recuperação de senha aparecem em seguida. Os cards do Binho IA e Geo Mundo também apresentam capturas reais com enquadramento ampliado por CSS. As imagens estão em `public/assets`. Para trocar ou acrescentar capturas ao carrossel, atualize os itens `.carousel-slide` em `public/index.html` com descrições fiéis. O JavaScript atualiza a contagem automaticamente.

## Arquivos principais

- `public/index.html`: apresentação, projetos, links e formulário.
- `public/styles.css`: layout responsivo e paleta.
- `public/script.js`: formulário e carrossel acessível.
- `public/background.js`, `public/motion.js`, `public/vendor/`: linhas topográficas animadas em Three.js, animações GSAP e bibliotecas locais. O fundo pausa quando o visitante escolhe movimento reduzido e oferece controle de pausa no rodapé.

O formulário continua a usar FormSubmit. O Chatbot é um conceito hipotético e está identificado no card como não oficial da Binho Celulares.
