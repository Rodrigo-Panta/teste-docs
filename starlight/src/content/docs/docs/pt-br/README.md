---
title: Hello, World!
description: This is a page in my Starlight-powered site
---
# AxisResult — Documentação

> 🌐 [English (readme principal)](../../index)

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

Cada operação **ou** tem sucesso e segue no trilho de cima, **ou** falha e cai no de baixo — pulando todo o resto. Sem `try/catch`, sem `if (x == null)`, sem `return` no meio do handler. → **[Railway-Oriented Programming](railway-oriented-programming)**

### `AxisResult` vs `AxisResult<T>` — "sem dados" e "com dados"

- **`AxisResult`** — o desfecho de uma operação que **não produz valor**: só importa se deu certo (salvar, deletar, validar, verificar senha).
- **`AxisResult<T>`** — carrega um **valor** pela trilha de sucesso (buscar entidade, calcular total). `.Value` lança numa falha → prefira a [desestruturação segura ou `Match`](match).
- Transitar entre os dois: [`ToAxisResult`](then) descarta o valor; [`WithValue`](ensure) promove um `AxisResult` para `AxisResult<T>`.

### Criar resultados

```csharp
AxisResult         ok    = AxisResult.Ok();
AxisResult<int>    typed = AxisResult.Ok(42);
AxisResult<int>    fail  = AxisError.BusinessRule("INSUFFICIENT_STOCK"); // AxisError → falha (implícito)
AxisResult<string> name  = "John";                                       // valor → Ok (implícito)
AxisResult<int>    parse = AxisResult.Try(() => int.Parse(input));        // exceção → AxisResult, só na borda
```

### Tratamento de erros

Um erro é um **valor** (`AxisError` = `Code` + `Type`), não uma exceção. As 12 categorias mapeiam para status HTTP, e `IsTransient` habilita retry. → **[Erros e tipos](errors-and-types)**

### `Task` vs `ValueTask`

Na dúvida, use `Task`. `ValueTask` só em *hot paths* que completam de forma síncrona. → **[Task vs ValueTask](async-task-vs-valuetask)**

### Instalação

```
dotnet add package AxisResult
```

→ Guia completo: **[Primeiros passos](getting-started)**

---

## O mapa (salte para o que precisa)

| Grupo                           | Você quer…                                        | Detalhe                            |
|---------------------------------|---------------------------------------------------|------------------------------------|
| **Transformar · `Map`**         | mudar o valor (não pode falhar)                   | [map](map)                   |
| **Encadear · `Then`** ⭐         | um passo que **pode falhar** (coração da library) | [then](then)                 |
| **Garantir · `Ensure`**         | validar um invariante inline                      | [ensure](ensure)             |
| **Sair · `Match`**              | colapsar o pipeline num valor final               | [match](match)               |
| **Efeitos · `Tap`**             | observar (log/métrica) sem mudar a trilha         | [tap](tap)                   |
| **Recuperar · `Recover`**       | tratar a falha e voltar ao sucesso                | [recover](recover)           |
| **Combinar · `Zip`**            | juntar valores **diferentes** numa tupla          | [zip](zip)                   |
| **Agregar · `Combine`/`All`**   | reduzir **N** resultados a um                     | [aggregate](aggregate)       |
| **Remapear erros · `MapError`** | reescrever erros entre camadas                    | [map-errors](map-errors)     |
| **Cancelamento**                | passar `CancellationToken` pela cadeia            | [cancellation](cancellation) |

**Comece aqui:** [Primeiros passos](getting-started) · [Railway-Oriented Programming](railway-oriented-programming) · [Por que AxisResult?](why-axisresult)

**Fundamentos:** [Erros e tipos](errors-and-types) · [`Task` vs `ValueTask`](async-task-vs-valuetask) · [Exceções na borda](boundary-and-try)

**Referência e extras:** [Referência da API](api-reference) · [Sintaxe de query LINQ](linq-query-syntax) · [Ergonomia](ergonomics)

---

## Princípios de design

1. **Erros são valores, não exceções.** Uma operação que pode falhar diz isso no tipo de retorno.
2. **O sistema de tipos é a documentação.** `Task<AxisResult<User>>` já diz tudo que pode acontecer.
3. **Composição em vez de cerimônia.** Operações pequenas e focadas que se compõem.
4. **Falhe rápido, recupere de propósito.** Erros propagam sozinhos; recuperação é sempre explícita.
5. **Exceções na borda, resultados em todo o resto.** `AxisResult.Try()` nas bordas de infraestrutura; acima disso, livre de exceções.
