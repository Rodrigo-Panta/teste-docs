---
title: AxisResultDocumentao
---


**Railway-Oriented Programming para C#** — uma *Result monad* sem dependências, com `async`/`ValueTask` completos, categorias de erro tipadas e composição monádica (`Then` / `Map` / `Zip`).

Use esta página como **mapa**: leia o tronco abaixo (~5 min) e salte direto para o detalhe do grupo que você precisa — sem ler centenas de linhas.

---

## O tronco (leia primeiro)

### Railway em 60 segundos

Imagine seu código como uma ferrovia de dois trilhos:

```
Sucesso ━━━━━●━━━━━━━━━━●━━━━━━━━━━●━━━━▶  resultado
             │          │          │
          validar     buscar     salvar
             │          │          │
Falha   ━━━━━╋━━━━━━━━━━╋━━━━━━━━━━╋━━━━▶  erros
```

Cada operação **ou** tem sucesso e segue no trilho de cima, **ou** falha e cai no de baixo — pulando todo o resto. Sem `try/catch`, sem `if (x == null)`, sem `return` no meio do handler. → **[Railway-Oriented Programming](/teste-docs/pt-br/railway-oriented-programming)**

### `AxisResult` vs `AxisResult<T>` — "sem dados" e "com dados"

- **`AxisResult`** — o desfecho de uma operação que **não produz valor**: só importa se deu certo (salvar, deletar, validar, verificar senha).
- **`AxisResult<T>`** — carrega um **valor** pela trilha de sucesso (buscar entidade, calcular total). `.Value` lança numa falha → prefira a [desestruturação segura ou `Match`](/teste-docs/pt-br/match).
- Transitar entre os dois: [`ToAxisResult`](/teste-docs/pt-br/then) descarta o valor; [`WithValue`](/teste-docs/pt-br/ensure) promove um `AxisResult` para `AxisResult<T>`.

### Criar resultados

```csharp
AxisResult         ok    = AxisResult.Ok();
AxisResult<int>    typed = AxisResult.Ok(42);
AxisResult<int>    fail  = AxisError.BusinessRule("INSUFFICIENT_STOCK"); // AxisError → falha (implícito)
AxisResult<string> name  = "John";                                       // valor → Ok (implícito)
AxisResult<int>    parse = AxisResult.Try(() => int.Parse(input));        // exceção → AxisResult, só na borda
```

### Tratamento de erros

Um erro é um **valor** (`AxisError` = `Code` + `Type`), não uma exceção. As 12 categorias mapeiam para status HTTP, e `IsTransient` habilita retry. → **[Erros e tipos](/teste-docs/pt-br/errors-and-types)**

### `Task` vs `ValueTask`

Na dúvida, use `Task`. `ValueTask` só em *hot paths* que completam de forma síncrona. → **[Task vs ValueTask](/teste-docs/pt-br/async-task-vs-valuetask)**

### Instalação

```
dotnet add package AxisResult
```

→ Guia completo: **[Primeiros passos](/teste-docs/pt-br/getting-started)**

---

## O mapa (salte para o que precisa)

| Grupo                           | Você quer…                                        | Detalhe                            |
|---------------------------------|---------------------------------------------------|------------------------------------|
| **Transformar · `Map`**         | mudar o valor (não pode falhar)                   | [map.md](/teste-docs/pt-br/map)                   |
| **Encadear · `Then`** ⭐         | um passo que **pode falhar** (coração da library) | [then.md](/teste-docs/pt-br/then)                 |
| **Garantir · `Ensure`**         | validar um invariante inline                      | [ensure.md](/teste-docs/pt-br/ensure)             |
| **Sair · `Match`**              | colapsar o pipeline num valor final               | [match.md](/teste-docs/pt-br/match)               |
| **Efeitos · `Tap`**             | observar (log/métrica) sem mudar a trilha         | [tap.md](/teste-docs/pt-br/tap)                   |
| **Recuperar · `Recover`**       | tratar a falha e voltar ao sucesso                | [recover.md](/teste-docs/pt-br/recover)           |
| **Combinar · `Zip`**            | juntar valores **diferentes** numa tupla          | [zip.md](/teste-docs/pt-br/zip)                   |
| **Agregar · `Combine`/`All`**   | reduzir **N** resultados a um                     | [aggregate.md](/teste-docs/pt-br/aggregate)       |
| **Remapear erros · `MapError`** | reescrever erros entre camadas                    | [map-errors.md](/teste-docs/pt-br/map-errors)     |
| **Cancelamento**                | passar `CancellationToken` pela cadeia            | [cancellation.md](/teste-docs/pt-br/cancellation) |

**Comece aqui:** [Primeiros passos](/teste-docs/pt-br/getting-started) · [Railway-Oriented Programming](/teste-docs/pt-br/railway-oriented-programming) · [Por que AxisResult?](/teste-docs/pt-br/why-axisresult)

**Fundamentos:** [Erros e tipos](/teste-docs/pt-br/errors-and-types) · [`Task` vs `ValueTask`](/teste-docs/pt-br/async-task-vs-valuetask) · [Exceções na borda](/teste-docs/pt-br/boundary-and-try)

**Referência e extras:** [Referência da API](/teste-docs/pt-br/api-reference) · [Sintaxe de query LINQ](/teste-docs/pt-br/linq-query-syntax) · [Ergonomia](/teste-docs/pt-br/ergonomics)

---

## Princípios de design

1. **Erros são valores, não exceções.** Uma operação que pode falhar diz isso no tipo de retorno.
2. **O sistema de tipos é a documentação.** `Task<AxisResult<User>>` já diz tudo que pode acontecer.
3. **Composição em vez de cerimônia.** Operações pequenas e focadas que se compõem.
4. **Falhe rápido, recupere de propósito.** Erros propagam sozinhos; recuperação é sempre explícita.
5. **Exceções na borda, resultados em todo o resto.** `AxisResult.Try()` nas bordas de infraestrutura; acima disso, livre de exceções.
