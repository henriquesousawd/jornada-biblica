# Jornada Bíblica — MVP 1

Aplicativo web instalável (PWA) em português para ler a Bíblia, importar narração humana por capítulo e retomar no segundo em que parou. Não exige contas ou serviços pagos.

## Iniciar

1. Instale Python 3, caso não esteja instalado.
2. Abra um terminal **na pasta `jornada-biblica`** e execute:

   `python -m http.server 8000`

3. Abra `http://localhost:8000` no navegador Chrome ou Edge.
4. Escolha `Gênesis` ou outro livro. Clique em **+ Áudio do capítulo**, escolha seu MP3 e clique em **▶**. O progresso é salvo automaticamente.
5. Para testar offline, carregue a página uma vez, importe um áudio, depois desconecte a internet e recarregue o site. O service worker pode precisar de uma recarga adicional para completar a instalação.
6. Para instalar como aplicativo, procure **Instalar** na barra de endereço do Chrome/Edge ou use o botão do topo quando ele aparecer.

**Importante:** Abrir `index.html` diretamente com duplo clique não oferece PWA/offline completo. Use localhost ou hospedagem HTTPS.

## Estado real da versão 1

- Há navegação pelos 66 livros e seus 1.189 capítulos.
- **A Bíblia completa em texto NÃO está incluída no pacote.** Apenas os três primeiros versículos de Gênesis 1 aparecem como exemplo. Isso evita redistribuir acidentalmente uma edição protegida. Para ler a Bíblia completa, importe um JSON de tradução com licença apropriada.
- **Áudios humanos NÃO estão incluídos no pacote.** O usuário deve importar gravações legítimas em cada capítulo. Elas ficam armazenadas no IndexedDB deste aparelho e podem tocar offline.
- Salva capítulo e posição em segundos, capítulos concluídos, velocidade de reprodução e tamanho da fonte (exceto velocidade, que retorna a 1× ao recarregar).
- A posição é armazenada localmente por aparelho. **Não sincroniza entre dispositivos** nesta versão. Excluir os dados do site do navegador apaga o progresso e os arquivos importados.
- Arquivos grandes podem exceder a cota de armazenamento do navegador. A persistência dos dados offline depende das regras de armazenamento do navegador.

## Importar texto integral da Bíblia

No site, clique **Importar Bíblia JSON**. Arquivo aceito: array com 66 livros (na ordem protestante padrão), cada livro um array de capítulos, cada capítulo um array de strings de versículos. Também aceita `{ "books": [{ "chapters": [{ "verses": ["texto..."] }] }] }` com 66 livros.

Exemplo **de estrutura** (não é um arquivo de Bíblia completo):

```json
[
  [
    ["Versículo 1 do capítulo 1", "Versículo 2 do capítulo 1"],
    ["Versículo 1 do capítulo 2"]
  ]
]
```

O exemplo acima **não** passa na importação porque é apenas um livro. O arquivo verdadeiro precisa conter 66 livros.

Fonte a avaliar para obtenção de texto devidamente licenciado: https://www.gutenberg.org/ebooks/62383 (Almeida 1911, domínio público nos Estados Unidos; confira condições locais e eventuais direitos da edição digital).

Fonte de áudios humanos a avaliar: https://librivox.org/4205 (LibriVox declara suas gravações em domínio público **nos EUA**; antes de publicar ou redistribuir no Brasil, confira a situação jurídica aplicável).

## Publicação

Por ser um site estático, basta colocar os arquivos em uma hospedagem HTTPS (como Vercel, Cloudflare Pages, Netlify ou GitHub Pages). Não coloque músicas, narrações ou traduções que não estejam licenciadas para distribuição. Para sincronização entre dispositivos e conta do usuário, será necessário acrescentar autenticação e banco de dados remoto em uma próxima versão.

## Arquivos

- `index.html` interface
- `styles.css` layout responsivo
- `app.js` lógica, armazenamento local, player, importação de arquivos
- `sw.js` cache offline da interface
- `manifest.webmanifest` instalação de PWA
- `icon.svg` ícone

## Áudio e validação

- `AUDIO_SOURCES.md` registra as fontes avaliadas e as pendências de licença.
- `data/audio-catalog.json` registra a política de catálogo; a lista completa de 66 livros e 1.189 capítulos permanece em `app.js`.
- A posição, velocidade, capítulos concluídos e arquivo importado permanecem no IndexedDB local. O player oferece salto de 10 segundos, cinco velocidades e Media Session quando o navegador oferece essa API.
- Não há URL externa de áudio embutida: isso evita redistribuir uma gravação cuja licença para o Brasil não foi confirmada.
- `data/local-audio-config.example.json` mostra como registrar uma fonte externa para uso local; permanece desativado até que a licença seja confirmada.
- `scripts/download-bible-text.mjs` valida uma fonte HTTPS licenciada antes de gerar `data/bible.json`. O aplicativo carrega esse arquivo automaticamente quando ele existir.
- `data/bible.json` agora contém a Almeida Livre 1819 completa: 66 livros, 1.189 capítulos e 31.102 versículos. A fonte e o metadata estão registrados em `data/almeida-livre-metadata.json` e `data/bible-data-SOURCES.md`.
- `data/audio-providers.json` registra provedores, narradores, disponibilidade e pendências de autorização sem expor credenciais.
- `server/bible-brain-adapter.mjs` é o adaptador server-side; configure `BIBLE_BRAIN_API_KEY` somente no servidor.
- `scripts/build-audio-manifest.mjs` cria manifesto de gravações próprias, calcula SHA-256 e tamanho, e exige nomenclatura `GEN-001.mp3`/`GEN_001.mp3`. Duração pode ser preenchida posteriormente por ferramenta de mídia autorizada; offsets não são inventados.
- `tests/audio-infrastructure.test.mjs` valida a política do manifesto e garante que os 66 livros/1.189 capítulos/31.102 versículos não foram alterados.

Para importar uma edição autorizada: `node scripts/download-bible-text.mjs https://exemplo.org/bible.json data/bible.json`. A fonte precisa fornecer 66 livros e 1.189 capítulos; a página de downloads da Encyclopaedia Biblica atualmente exige JavaScript e não expõe um arquivo/licença direta verificável para automação.

Validação manual: importe um MP3 autorizado, reproduza, pause, recarregue e use “Continuar de onde parei”; em seguida desligue a rede e recarregue o site servido por localhost. Verifique também os botões de capítulo anterior/próximo e os controles da tela bloqueada em um navegador compatível.
