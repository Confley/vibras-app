# NNN · <Nombre del plan> — Plan

_Para el agente. El humano lee `resumen.md`; aquí va todo lo demás. Borra las notas en cursiva y lo que esté entre `<…>`._

**Estado:** <borrador | aprobado | en curso | hecho | abandonado>
**Depende de:** <`NNN-otro-plan` (qué de él usa) | nada>
**Expone:** <lo que otros planes podrán usar cuando esto esté hecho: función, tabla, evento, endpoint, variable. Una línea por cosa, con su archivo. Si nada, «nada».>
**Docs:** <fichas de `docs/` que este plan usa, ej. `../../../docs/apis/<servicio>.md` | ninguna>

## Dónde vamos

_El bloque que se lee al retomar (el hook de inicio lo inyecta). Se actualiza al cerrar cada paso,
antes de empezar el siguiente. Máximo diez líneas: es un puntero, no un diario._

- **Último paso cerrado:** <n · qué quedó>
- **Siguiente:** <n · qué toca>
- **Decidido en marcha:** <cambios al plan que salieron construyendo, con su porqué>
- **Tocado:** <archivos o módulos que ya cambiaron>
- **Abierto:** <dudas para el humano; cosas que dependen de él>

## Contexto

<Lo que el humano pasó (funcionalidad, historias de usuario, especificaciones, docs), resumido. Lo
largo se guarda en esta carpeta y se enlaza aquí. Y lo que encontraste al mapear el código real: qué
módulos toca, qué ya existe, qué no.>

## Enfoque

<Estrategia en pocas frases: qué camino se toma y por qué encaja con la constitución. Alternativas
descartadas y por qué.>

## Pasos

_En orden. Cada paso trae su tier de riesgo (workflow §2 B) y los archivos que toca. Los tests van
dentro del paso, no al final. Marca `[x]` al cerrar y actualiza «Dónde vamos»._

1. [ ] <Paso — archivos · Tier SIMPLE>
2. [ ] <Paso — archivos · Tier MODERADO>
3. [ ] <Pruebas del comportamiento de arriba · Tier SIMPLE>
4. [ ] Comprobar cada check de `resumen.md` y marcarlo.
5. [ ] Revisar que lo que un humano configura a mano ya esté en `PUESTA-EN-PRODUCCION.md`.
6. [ ] Cerrar: `Estado: hecho` en los dos archivos; roadmap a «Hecho» con fecha.

## Decisiones

- **<Decisión>** — <por qué; qué se descartó>.

## Riesgos

- **<Riesgo>** — <cómo se acota>.

## Fuera de alcance

- <Lo que no entra, y a dónde se va (otro plan, ideas del roadmap).>
