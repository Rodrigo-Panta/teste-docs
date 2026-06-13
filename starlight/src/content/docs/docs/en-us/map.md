---
title: Hello, World!
description: This is a page in my Starlight-powered site
---
# Transform · `Map`

> Transforms the value on the success rail with a function that **cannot fail**. On the failure rail, `Map` does nothing — the error flows straight through.

```csharp
AxisResult<int>    n = AxisResult.Ok(21);
AxisResult<string> s = n.Map(x => $"value: {x * 2}");   // Ok("value: 42")
```

---

## When to use

The transformation **cannot fail**: building a DTO, formatting, projecting a field.

## When *not* to use

| You want to… | Use instead |
|---|---|
| a step that **can fail** (returns `AxisResult`) | [`Then`](/teste-docs/docs/en-us/then) |
| **observe** the value without transforming it | [`Tap`](/teste-docs/docs/en-us/tap) |
| transform **errors**, not the value | [`MapError`](/teste-docs/docs/en-us/map-errors) |

---

## Forms

| Method | Signature | Where |
|---|---|---|
| `Map` | `T → TNew` | sync · `Task` · `ValueTask` · [+CT](/teste-docs/docs/en-us/cancellation) |
| `Select` | `T → TNew` (LINQ syntax) | sync |
| `Map((a, b) => …)` | destructures the tuple from [`Zip`](/teste-docs/docs/en-us/zip) | `Task` (tuples T2–T4) |

```csharp
// fluent
var dto = GetUser(id).Map(u => new UserDto(u.Name));

// LINQ (equivalent)
var dto = from u in GetUser(id) select new UserDto(u.Name);
```

---

## Real-world example — query handler

A query goes straight from the handler to the port and projects the entity into the response:

```csharp
public Task<AxisResult<GetExternalApiByIdResponse>> HandleAsync(GetExternalApiByIdQuery query)
    => readerPort.GetByIdAsync(query.ExternalApiId)        // AxisResult<Entity> → NotFound if it doesn't exist
        .MapAsync(entity => new GetExternalApiByIdResponse
        {
            ExternalApiId = entity.ExternalApiId,
            Name = entity.ApiName
        });
```

**Why it pays off:** if the entity doesn't exist, the port returns `AxisError.NotFound(...)` and `MapAsync` **never runs** — the error propagates cleanly, with no `if (entity == null)`.

---

## See also

- [Chain · `Then`](/teste-docs/docs/en-us/then) — when the next step can fail
- [Combine · `Zip`](/teste-docs/docs/en-us/zip) — keep two values and destructure them in `Map`
- [Side effects · `Tap`](/teste-docs/docs/en-us/tap) — observe without transforming

---

↩ [Back to AxisResult docs](/teste-docs/index.html)
