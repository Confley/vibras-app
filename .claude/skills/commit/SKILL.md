---
name: commit
description: "Hacer commit de los cambios y opcionalmente abrir/actualizar un PR. Úsalo cuando el humano dice 'haz commit', 'súbelo', 'abre PR'. Maneja también el modo solo-mensaje (dry run)."
---

# Commit

## Proceso

1. **Inspecciona.** `git status` + `git diff` (y `git diff --staged`). Entiende qué cambió de verdad.
2. **Resuelve el scope.** ¿Todos los cambios, o solo los de una feature concreta? Si hay cambios mezclados
   no relacionados, sepáralos en commits distintos.
3. **Mensaje.** Imperativo. En inglés si describe código; en español si describe algo funcional/UX.
   Una línea de asunto < 72 chars; cuerpo con el "qué" y el "por qué" si no es obvio.
4. **Rama.** Si estás en la rama por defecto (main/master), **crea una rama** antes de commitear.
5. **Push** solo si el humano lo pidió: `git push -u origin <rama>`.
6. **PR** solo si el humano lo pidió: `gh pr create` con título y descripción que enlace al ticket/contexto.
7. **Reporta** archivos commiteados y la URL del PR.

## Reglas

- Commitea o pushea **solo cuando el humano lo pide**. No es automático tras cada cambio.
- **Nunca** commitees `.env` ni secretos. Verifica `git status` antes.
- No uses `--no-verify` ni saltes hooks salvo que el humano lo pida explícitamente. Si un hook falla, arréglalo.
- Prefiere un commit nuevo a `--amend` sobre algo ya pusheado.

## Modo solo-mensaje (dry run)

Si el humano dice "sin PR" / "solo el mensaje" / "dry run": entrega el plan de staging + el mensaje de commit
propuesto, **sin** ejecutar comandos git.
