---
description: "Reflexiona al cierre de una sesión y decide qué vale la pena guardar en la memoria persistente del proyecto."
---

# /que-guardar

> Esto es el **backstop, no el camino principal.** Lo ideal es que las lecciones ya se hayan capturado
> inline al momento de cada arreglo (ver `CLAUDE.md` §5). Aquí solo barres lo que se escapó.

Al final de una sesión con aprendizajes, decide qué sobrevive a esta conversación. La memoria mala
(ruido, duplicados, cosas obvias) es peor que ninguna: ensucia el contexto futuro.

## 1. Reflexiona

Repasa la sesión y junta candidatos:
- Gotchas: algo que falló de forma no obvia y cómo se resolvió.
- Descubrimientos: shape real de una API, comportamiento inesperado de una lib/herramienta.
- Decisiones: por qué se eligió A sobre B (que no se deduce del código).
- Anti-patrones / convenciones del repo que no estaban escritas.
- Feedback del humano sobre cómo debes trabajar.

## 2. Filtra sin piedad

Descarta un candidato si:
- Es derivable del código o del git history.
- Solo importa a esta conversación (no a una feature futura).
- Ya está cubierto por un archivo de memoria existente (entonces **actualiza** ese archivo, no crees otro).
- **Poda:** si una lección vieja quedó obsoleta o ya fue absorbida por el código/`CLAUDE.md`, bórrala. La memoria que no se poda se vuelve ruido en 2 años.

## 3. Decide dónde va

| Tipo | Destino |
| ---- | ------- |
| Gotcha transversal (aplica a >1 plan) | `.claude/memory/LESSONS.md` (entrada fechada) |
| Anti-patrón / convención no obvia del repo | `.claude/memory/feedback/<slug>.md` |
| Decisión del proyecto que no cabe en ningún plan | `.claude/memory/project/<slug>.md` (el estado de un plan vive en su «Dónde vamos») |
| Ficha de API / sistema externo | `docs/apis/<servicio>.md` + línea en `docs/_indice.md` (es doc, no memoria) |
| Cambia *cómo trabajas* (CLAUDE.md) | **Propónselo al humano.** No edites CLAUDE.md solo. |

## 4. Propón antes de escribir

Lista los candidatos que pasaron el filtro y su destino. Deja que el humano confirme antes de escribir.

## 5. Escribe

Para LESSONS.md usa el formato fechado:

```markdown
### YYYY-MM-DD — <título corto>
- **Qué fallé / qué descubrí:** <1-2 líneas>
- **Fix / regla nueva:** <1-2 líneas>
- **Aplicar en:** <dónde cuenta esto>
```

Y añade una línea-puntero en `.claude/memory/MEMORY.md` si creaste un archivo nuevo en feedback/project
(y en `docs/_indice.md` si fue una ficha de `docs/apis/`).
