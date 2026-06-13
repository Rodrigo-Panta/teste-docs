---
title: RefernciadaAPI
---

> O catálogo completo de operadores, agrupado por responsabilidade. Use como consulta — cada grupo tem uma página de detalhe com exemplos.

---

## Criar resultados

| Método | Descrição |
|--------|-------------|
| `AxisResult.Ok()` | sucesso sem valor |
| `AxisResult.Ok(value)` | sucesso com valor |
| `AxisResult.Error(error)` | falha a partir de um único erro |
| `AxisResult.Error(errors)` | falha a partir de múltiplos erros |
| `AxisResult.Try(action)` | embrulha uma ação que pode lançar |
| `AxisResult.Try(func)` | embrulha uma função que pode lançar |
| `AxisResult.TryAsync(action)` | versão async de `Try` |
| `AxisResult.TryAsync(func)` | versão async de `Try` com valor de retorno |
| Implícito: `value` | atribui qualquer valor onde se espera `AxisResult<T>` |
| Implícito: `AxisError` | atribui um erro onde se espera `AxisResult` |

→ [Primeiros passos](/teste-docs/pt-br/getting-started) · [Exceções na borda · `Try`](/teste-docs/pt-br/boundary-and-try)

---

## Transformar (trilho de sucesso)

| Método | Assinatura | Descrição |
|--------|-----------|-------------|
| `Map` | `T -> TNew` | transforma o valor (puro, não pode falhar) |
| `MapAsync` | `T -> Task<TNew>` | transformação async |
| `Then` | `T -> AxisResult<TNew>` | encadeia uma operação falível que retorna um novo valor |
| `Then` | `T -> AxisResult` | encadeia um efeito falível, **preserva o valor original** |
| `ThenAsync` | versões async de ambas as sobrecargas de `Then` | |
| `ToAxisResult` | `T -> AxisResult` | encadeia um efeito falível, retorna um `AxisResult` sem valor |
| `ToAxisResultAsync` | versão async de `ToAxisResult` | |

→ [Transformar · `Map`](/teste-docs/pt-br/map) · [Encadear · `Then`](/teste-docs/pt-br/then)

---

## Efeitos colaterais

| Método | Descrição |
|--------|-------------|
| `Tap(action)` | roda efeito no sucesso, devolve o resultado original |
| `TapAsync(func)` | efeito async no sucesso |
| `TapError(action)` | roda efeito na falha (logging, métricas) |
| `TapErrorAsync(func)` | efeito async na falha |

→ [Efeitos · `Tap`](/teste-docs/pt-br/tap)

---

## Validação

| Método | Descrição |
|--------|-------------|
| `Ensure(predicate, error)` | guarda — falha se o predicado for falso |
| `Ensure(func)` | validação delegada — `func` retorna `AxisResult` |
| `EnsureAsync` | versões async |

→ [Garantir · `Ensure`](/teste-docs/pt-br/ensure)

---

## Efeitos colaterais falíveis

| Método | Descrição |
|--------|-------------|
| `ActionAsync(func)` | roda uma operação falível (`T -> Task<AxisResult>`) e **preserva o valor original** no sucesso. Diferente de `ThenAsync`, que substitui o valor, `ActionAsync` o mantém — ideal para validação de domínio, persistência, ou qualquer passo em que você precise do valor adiante |

→ [Encadear · `Then`](/teste-docs/pt-br/then)

---

## Combinar valores

| Método | Descrição |
|--------|-------------|
| `Zip(func)` | combina o valor atual com um novo numa tupla |
| `ZipAsync(func)` | versão async |
| Encadeado: `.Zip().Zip()` | constrói tuplas até `(T1, T2, T3, T4)` |
| `MapAsync((a, b) => ...)` | desestrutura tuplas no mapper |

→ [Combinar · `Zip`](/teste-docs/pt-br/zip)

---

## Agregação

| Método | Descrição |
|--------|-------------|
| `Combine(results...)` | junta N resultados — coleta **todos** os erros |
| `CombineAsync(tasks)` | versão async |
| `All(results)` | junta N resultados tipados em `IReadOnlyList<T>` |
| `AllAsync(tasks)` | versão async |
| `ZipParallelAsync(() => other)` | roda uma op independente em paralelo, junta na tupla, acumula erros se ambos falharem |
| `ZipParallelAsync(ct => other, ct)` | variante ciente de CT |

→ [Agregar · `Combine`/`All`](/teste-docs/pt-br/aggregate) · [Combinar · `Zip`](/teste-docs/pt-br/zip)

---

## Recuperação e fallbacks

| Método | Descrição |
|--------|-------------|
| `Recover(value)` | na falha, substitui por um padrão |
| `Recover(func)` | na falha, computa um fallback |
| `RecoverWhen(predicate, func)` | recupera só se os erros casam com uma condição |
| `RecoverWhen(AxisErrorType, func)` | recupera só para um tipo de erro específico |
| `RecoverWhen(code, func)` | recupera só para um código de erro específico |
| `RecoverNotFound(func)` | recupera só se todos os erros são `NotFound` |
| `OrElse(fallback)` | tenta uma operação alternativa |
| `OrElse(fallback, combineErrors: true)` | alternativa com acúmulo de erros |

→ [Recuperar · `Recover`](/teste-docs/pt-br/recover)

---

## Guardas de existência

| Método | Descrição |
|--------|-------------|
| `RequireNotFound(error)` | achou → erro, `NotFound` → `Ok`, outros erros → propaga |
| `RequireNotFoundAsync(error)` | versão async |
| `WithValueAsync(value)` | promove `AxisResult` para `AxisResult<T>` com um valor |

→ [Garantir · `Ensure`](/teste-docs/pt-br/ensure)

---

## Transformação de erros

| Método | Descrição |
|--------|-------------|
| `MapError(func)` | transforma cada erro individualmente |
| `MapError(func<list>)` | transforma/filtra a lista inteira de erros |
| `MapErrorAsync` | versões async |

→ [Remapear erros · `MapError`](/teste-docs/pt-br/map-errors)

---

## Terminal

| Método | Descrição |
|--------|-------------|
| `Match(onSuccess, onFailure)` | converte para um tipo final — roda exatamente um ramo |
| `MatchAsync` | versão async |

→ [Sair · `Match`](/teste-docs/pt-br/match)

---

## LINQ

| Sintaxe | Equivalente |
|--------|------------|
| `from x in result select f(x)` | `result.Map(f)` |
| `from x in r1 from y in r2 select ...` | `r1.Then(x => r2).Map(...)` |
| `SelectManyAsync` | encadeamento LINQ async |

→ [Sintaxe de query LINQ](/teste-docs/pt-br/linq-query-syntax)

---

## Conversão

| Método | Descrição |
|--------|-------------|
| `AsTaskAsync()` | embrulha um resultado síncrono em `Task` |
| `AsValueTaskAsync()` | embrulha um resultado síncrono em `ValueTask` |

→ [`Task` vs `ValueTask`](/teste-docs/pt-br/async-task-vs-valuetask)

---

## Cancelamento

Todo operador async central tem uma sobrecarga ciente de CT cujo delegate recebe o token como segundo parâmetro. Disponível em `Task<AxisResult<T>>` **e** `ValueTask<AxisResult<T>>`:

| Método | Forma do delegate |
|--------|----------------|
| `ThenAsync` | `(T, CancellationToken) => Task<AxisResult<TNew>>` |
| `ThenAsync` | `(T, CancellationToken) => Task<AxisResult>` (preserva o valor) |
| `ToAxisResultAsync` | `(T, CancellationToken) => Task<AxisResult>` |
| `MapAsync` | `(T, CancellationToken) => Task<TNew>` |
| `TapAsync` | `(T, CancellationToken) => Task` |
| `EnsureAsync` | `(T, CancellationToken) => Task<bool>` |
| `EnsureAsync` | `(T, CancellationToken) => Task<AxisResult>` |
| `ZipAsync` | `(T, CancellationToken) => Task<TNew>` |
| `ZipAsync` | `(T, CancellationToken) => Task<AxisResult<TNew>>` |
| `ActionAsync` | `(T, CancellationToken) => Task<AxisResult>` (preserva o valor) |
| `ZipParallelAsync` | `(CancellationToken) => Task<AxisResult<TNew>>` |

→ [Cancelamento](/teste-docs/pt-br/cancellation)

---

## Desestruturação

| Sintaxe | Produz |
|--------|--------|
| `var (isSuccess, errors) = result` | `AxisResult` |
| `var (isSuccess, value, errors) = result` | `AxisResult<T>` (`value` é `default` na falha) |

→ [Ergonomia](/teste-docs/pt-br/ergonomics)

---

## Veja também

- [Primeiros passos](/teste-docs/pt-br/getting-started) — como criar e inspecionar resultados
- [Encadear · `Then`](/teste-docs/pt-br/then) — o operador central do railway
- [Documentação completa](/teste-docs/pt-br/index.html) — o mapa de toda a documentação

---

↩ [Voltar à documentação do AxisResult](/teste-docs/pt-br/index.html)
