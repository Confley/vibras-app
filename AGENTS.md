# AGENTS.md

Este proyecto usa el harness **Urdimbre**. Las instrucciones de trabajo viven en
[`CLAUDE.md`](CLAUDE.md) y en [`.claude/rules/workflow.md`](.claude/rules/workflow.md) — léelos antes de actuar.

Resumen de una línea: **con plan escrito** (todo cambio grande nace en `spec/planes/NNN-…/` —`resumen.md` lo
aprueba el humano, `plan.md` lo lleva el agente— antes de código; la constitución manda), **ejecución graduada por riesgo** (trivial → hazlo; crítico → verifica + adversarial),
**agent-first** (el humano dice qué, tú haces cómo) y **el sistema aprende** (alimenta `.claude/memory/`).

Y una regla que se olvida siempre: todo lo que un humano tenga que configurar **fuera del código**
(cuenta, permiso del sistema, ajuste, paso de instalación) se anota en [`PUESTA-EN-PRODUCCION.md`](PUESTA-EN-PRODUCCION.md)
**en cuanto aparece**, nunca el día del despliegue.
