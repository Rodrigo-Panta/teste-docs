---
title: Hello, World!
description: This is a page in my Starlight-powered site
---
# Transformar · `Map`

> Transforma o valor da trilha de sucesso com uma função que **não pode falhar**. Na trilha de falha, `Map` não faz nada — o erro segue direto.

```csharp
AxisResult<int>    n = AxisResult.Ok(21);
AxisResult<string> s = n.Map(x => $"valor: {x * 2}");   // Ok("valor: 42")
```

---

## Quando usar

A transformação **não pode falhar**: montar um DTO, formatar, projetar um campo.

## Quando *não* usar

| Você quer… | Use no lugar |
|---|---|
| um passo que **pode falhar** (retorna `AxisResult`) | [`Then`](then) |
| **observar** o valor sem transformá-lo | [`Tap`](tap) |
| transformar **erros**, não o valor | [`MapError`](map-errors) |

---

## Formas

| Método | Assinatura | Onde |
|---|---|---|
| `Map` | `T → TNew` | sync · `Task` · `ValueTask` · [+CT](cancellation) |
| `Select` | `T → TNew` (sintaxe LINQ) | sync |
| `Map((a, b) => …)` | desestrutura a tupla de [`Zip`](zip) | `Task` (tuplas T2–T4) |

```csharp
// fluente
var dto = GetUser(id).Map(u => new UserDto(u.Name));

// LINQ (equivalente)
var dto = from u in GetUser(id) select new UserDto(u.Name);
```

---

## Exemplo real — query handler

Uma query vai direto do handler ao port e projeta a entidade na resposta:

```csharp
public Task<AxisResult<GetExternalApiByIdResponse>> HandleAsync(GetExternalApiByIdQuery query)
    => readerPort.GetByIdAsync(query.ExternalApiId)        // AxisResult<Entity> → NotFound se não existe
        .MapAsync(entity => new GetExternalApiByIdResponse
        {
            ExternalApiId = entity.ExternalApiId,
            Name = entity.ApiName
        });
```

**Por que compensa:** se a entidade não existe, o port devolve `AxisError.NotFound(...)` e o `MapAsync` **nunca roda** — o erro propaga limpo, sem `if (entity == null)`.

---

## Veja também

- [Encadear · `Then`](then) — quando o próximo passo pode falhar
- [Combinar · `Zip`](zip) — manter dois valores e desestruturar no `Map`
- [Efeitos · `Tap`](tap) — observar sem transformar
