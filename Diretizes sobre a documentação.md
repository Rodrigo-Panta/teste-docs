# Diretrizes sobre a documentação

Para a pipeline de scripts funcionar:

- Incluir todos os links para documentação interna como: [texto-do-link](./caminho-relativo/nome-do-arquivo.md)
- Em todos os arquivos, incluir apenas uma tag # (H1) como título do arquivo.
- Caracteres especiais (ex: `, ', $, @) são removidos dos headings H1;
- Em todos os locales (documentação referente a uma linguagem específica), incluir apenas uma referência a um locale diferente, um link no README.md com o emoji 🌐

Scripts utilizados na transformação:

- `transform-links-with-locale.js`
  - Para cada locale, resolve todos os links para o caminho no próprio locale:
    - Exemplo em inglês (locale padrão):

      ```markdown
      [meu-link](./xyz/meu-doc.md)
      vira
      [meu-link](/meu-doc)
      ```

    - Exemplo em português:

      ```markdown
      [meu-link](./pt-br/xyz/meu-doc.md)
      vira
      [meu-link](/pt-br/meu-doc)
      ```

- `transform-link.js` (não utilizado na pipeline)
  - Variação do `transform-links-with-locale.js` não utilizada.
  - Leva em conta o caminho relativo dos arquivos já presente no md:
  - Exemplo:

      ```markdown
      [meu-link](./pt-br/xyz/meu-doc.md)
      vira
      [meu-link](/pt-br/xyz/meu-doc)
      ```

- `remove-locale-reference.js`
  - Para cada locale, busca pela linha no arquivo index.md que contém o emoji 🌐 e a remove

- `transform-title.js`
  - Para cada arquivo de documentação, substitui a linha que começa com o caractere # seguido de espaço (o título) pelo título esperado pelo `Starlight`.
  - Exemplo:

    ``` Markdown
    # Meu Titulo
    vira
    ---
    title: Meu Título
    ---
    ```
