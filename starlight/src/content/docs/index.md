---
title: Clean Architecture
description: Estudo sobre Clean Architecture
---

# AxisResult — Documentation

> 🌐 [Português (documentação navegável)](docs/pt-br/readme)

**Railway-Oriented Programming for C#** — a zero-dependency *Result monad* with full `async`/`ValueTask` support, typed error categories and monadic composition (`Then` / `Map` / `Zip`).

```csharp
public Task<AxisResult<AddCellphoneResponse>> HandleAsync(AddCellphoneCommand )
    => personFactory.GetByIdAsync(.PersonId)
        .ThenAsync(person => cellphoneMediator.AddAsync(new() { CountryId = .CountryId, Number = .Number }))
        .ThenAsync(response => response.AddCellphoneAsync(.CellphoneId))
        .ThenAsync(_ => unitOfWork.SaveChangesAsync())
        .MapAsync(_ => new AddCellphoneResponse { CellphoneId = .CellphoneId });
```

Use this page as a **map**: read the trunk below (~5 min) and jump straight to the detail of the group you need — without reading hundreds of lines.

---

## The trunk (read first)

### Railway in 60 seconds

Imagine your code as a railway with two rails:

```
Success ━━━━━●━━━━━━━━━━●━━━━━━━━━━●━━━━▶  result
             │          │          │
          validate     fetch      save
             │          │          │
Failure ━━━━━╋━━━━━━━━━━╋━━━━━━━━━━╋━━━━▶  errors
```

Each operation **either** succeeds and stays on the top rail, **or** fails and drops to the bottom one — skipping everything else. No `try/catch`, no `if (x == null)`, no mid-handler `return`. → **[Railway-Oriented Programming](docs/en-us/railway-oriented-programming)**

### `AxisResult` vs `AxisResult<T>` — "no data" and "with data"

- **`AxisResult`** — the outcome of an operation that **produces no value**: only whether it worked matters (save, delete, validate, verify a password).
- **`AxisResult<T>`** — carries a **value** along the success rail (fetch an entity, compute a total). `.Value` throws on a failure → prefer the [safe deconstruction or `Match`](docs/en-us/match).
- Moving between the two: [`ToAxisResult`](docs/en-us/then) discards the value; [`WithValue`](docs/en-us/ensure) promotes an `AxisResult` to `AxisResult<T>`.

### Creating results

```csharp
AxisResult         ok    = AxisResult.Ok();
AxisResult<int>    typed = AxisResult.Ok(42);
AxisResult<int>    fail  = AxisError.BusinessRule("INSUFFICIENT_STOCK"); // AxisError → failure (implicit)
AxisResult<string> name  = "John";                                       // value → Ok (implicit)
AxisResult<int>    parse = AxisResult.Try(() => int.Parse(input));        // exception → AxisResult, only at the edge
```

### Error handling

An error is a **value** (`AxisError` = `Code` + `Type`), not an exception. The 12 categories map to HTTP status codes, and `IsTransient` enables retry. → **[Errors and types](docs/en-us/errors-and-types)**

### `Task` vs `ValueTask`

When in doubt, use `Task`. `ValueTask` only on *hot paths* that complete synchronously. → **[Task vs ValueTask](docs/en-us/async-task-vs-valuetask)**

### Installation

```
dotnet add package AxisResult
```

→ Full guide: **[Getting started](docs/en-us/getting-started)**

---

## The map (jump to what you need)

| Group                            | You want to…                                       | Detail                                  |
|----------------------------------|----------------------------------------------------|-----------------------------------------|
| **Transform · `Map`**            | change the value (cannot fail)                     | [map](docs/en-us/map)             |
| **Chain · `Then`** ⭐             | a step that **can fail** (heart of the library)    | [then](docs/en-us/then)           |
| **Ensure · `Ensure`**            | validate an invariant inline                       | [ensure](docs/en-us/ensure)       |
| **Exit · `Match`**               | collapse the pipeline into a final value           | [match](docs/en-us/match)         |
| **Side effects · `Tap`**         | observe (log/metric) without changing the rail     | [tap](docs/en-us/tap)             |
| **Recover · `Recover`**          | handle the failure and return to success           | [recover](docs/en-us/recover)     |
| **Combine · `Zip`**              | join **different** values into a tuple             | [zip](docs/en-us/zip)             |
| **Aggregate · `Combine`/`All`**  | reduce **N** results into one                      | [aggregate](docs/en-us/aggregate) |
| **Remap errors · `MapError`**    | rewrite errors between layers                      | [map-errors](docs/en-us/map-errors) |
| **Cancellation**                 | thread `CancellationToken` through the chain       | [cancellation](docs/en-us/cancellation) |

**Start here:** [Getting started](docs/en-us/getting-started) · [Railway-Oriented Programming](docs/en-us/railway-oriented-programming) · [Why AxisResult?](docs/en-us/why-axisresult)

**Fundamentals:** [Errors and types](docs/en-us/errors-and-types) · [`Task` vs `ValueTask`](docs/en-us/async-task-vs-valuetask) · [Exceptions at the boundary](docs/en-us/boundary-and-try)

**Reference & extras:** [API reference](docs/en-us/api-reference) · [LINQ query syntax](docs/en-us/linq-query-syntax) · [Ergonomics](docs/en-us/ergonomics)

---

## Design principles

1. **Errors are values, not exceptions.** An operation that can fail says so in its return type.
2. **The type system is the documentation.** `Task<AxisResult<User>>` already tells you everything that can happen.
3. **Composition over ceremony.** Small, focused operations that compose.
4. **Fail fast, recover deliberately.** Errors propagate on their own; recovery is always explicit.
5. **Exceptions at the boundary, results everywhere else.** `AxisResult.Try()` at infrastructure edges; above that, exception-free.

---

## License

Apache 2.0
