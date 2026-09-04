---
name: adversarial-review
description: "Revisión adversarial: asume que el cambio TIENE fallos e intenta romperlo contra su intención/spec. Úsalo en cambios CRÍTICOS antes de cerrar, o cuando el humano pide 'búscale fallos'. Idealmente en sesión/contexto nuevo para garantizar independencia."
---

# Adversarial review — intenta romperlo

No valides el happy path. **Asume que existen gaps, bugs y comportamiento inseguro, y trata de encontrarlos.**
El autor del cambio ya creyó que estaba bien; tu trabajo es demostrar lo contrario.

> Para independencia real, esta revisión se ejecuta en un **subagente con contexto limpio**, no en la sesión
> que escribió el código. El subagente recibe solo dos cosas: (1) la intención/spec del cambio y (2) el diff.
> No recibe las racionalizaciones del autor. Lánzalo con el **Agent tool** (tipo `code-reviewer` o `Explore`,
> con `model: opus` para máxima capacidad crítica), no lo corras inline.

## Paso 1 — Carga la intención primero

El agente principal prepara el "paquete de revisión" (intención + diff) y lo pasa al subagente. El subagente
hace los Pasos 1-5 y devuelve solo la tabla de veredicto.

Lee qué *debía* hacer el cambio antes de mirar el código: el pedido original, los criterios de aceptación,
`BUSINESS_LOGIC.md` o la fase del bucle. Anota los no-objetivos (qué NO debía pasar).

## Paso 2 — Carga la implementación

Lee el diff / los archivos tocados. Entiende qué hace realmente, no qué dice el commit que hace.

## Paso 3 — Pasada adversarial

Para cada parte, pregunta cómo podría fallar mientras el autor creía que pasaba:

- **Casos negativos / abuso:** input vacío, inválido, gigante; doble submit (race); IDOR (¿accede a datos ajenos?);
  replay; permisos saltados; valores fuera del enum esperado.
- **Estados límite:** lista vacía, primer/último elemento, concurrencia, fallo de un servicio externo a mitad.
- **Tests vs intención:** ¿los tests prueban lo que el spec pide, o solo lo que el código ya hace?
- **Errores tragados:** ¿hay `catch` que oculta un fallo real?

## Paso 4 — Clasifica los hallazgos

| Severidad   | Significa                                       | Acción            |
| ----------- | ----------------------------------------------- | ----------------- |
| **BLOCKER** | Viola la intención / problema de seguridad      | Detener. Arreglar antes de cerrar. |
| **MAJOR**   | Bug probable                                    | Arreglar antes de cerrar. |
| **MINOR**   | Claridad / robustez menor                       | Puede ir en un follow-up. |

## Paso 5 — Veredicto

Da uno de tres: **PASS** · **PASS CON GAPS** (lista los gaps) · **FAIL** (con los blockers).
Formato de salida — una tabla:

| Severidad | Área | Hallazgo | Evidencia | Fix sugerido |
| --------- | ---- | -------- | --------- | ------------ |

Si hay BLOCKER/MAJOR, el autor arregla y se re-verifica (`/verifica`) antes de declarar PASS.
