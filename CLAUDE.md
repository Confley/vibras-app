# Vibras app

App para Android que agrupa la música del teléfono en listas de reproducción por cómo suena.
Todo pasa en el teléfono: el reproductor de siempre lee las listas y la música nunca se toca.

Este repo usa **Urdimbre**: todo cambio grande nace de un plan escrito, y cada cambio se
ejecuta con la ceremonia que su riesgo merece. _No se teje sin urdimbre._

## Cómo trabajas (el método)

Léelo antes de actuar. Es el sistema operativo del agente: carriles (con plan / directo),
tiering por riesgo, auto-blindaje y reglas de código.

- @.claude/rules/workflow.md

## Qué construyes (la constitución — fuente de verdad)

El alcance, el stack y los límites duros viven en `spec/constitution/`. Si algo cambia,
se cambia **allí**. Un plan que choca con la constitución replantea el plan, no la
constitución. El ciclo de un plan (`plan.md` para el agente → `resumen.md` para el humano →
su OK → pasos, actualizando «Dónde vamos» al cerrar cada uno) está en `spec/README.md`.

- @spec/constitution/mission.md
- @spec/constitution/tech-stack.md
- @spec/constitution/roadmap.md

## Lo que un humano configura a mano

Todo lo que hay que hacer **fuera del código** para que la app corra en un teléfono nuevo o
llegue a otras manos (cuentas, permisos del sistema, firmas, pasos de instalación) vive en una
sola lista, en orden. **Se llena en cuanto aparece la necesidad, no el día de la entrega**
(ver `.claude/rules/workflow.md` §5b).

- @PUESTA-EN-PRODUCCION.md

---

# Detalle del proyecto

Lo que sigue describe **cómo está armado** el proyecto. Si algo de aquí choca con el método,
manda el método; si choca con la constitución, manda la constitución.

## La lógica de negocio vive fuera del repo

Qué hace la app, con qué reglas y por qué se decidió así está escrito y cerrado (4 de septiembre
de 2026) en las notas del autor; `BUSINESS_LOGIC.md` dice dónde. Este repo no las copia. Si el
código y las notas chocan, se corrige el código o se cambia la nota; nunca se inventa una regla
aquí. Las preguntas de negocio que salgan al construir se anotan en el plan y se le hacen al
humano; no se resuelven por cuenta propia.

## Dónde estamos

- No hay código todavía. El stack no está elegido: lo propone el primer plan y lo aprueba el
  humano en su `resumen.md`. Hasta entonces `spec/constitution/tech-stack.md` solo trae las
  restricciones que ya están fijas.
- El primer plan es la primera versión que analiza, reparte y escribe listas. Está en el roadmap.

## Vocabulario que se respeta

Los nombres de las notas mandan también en el código y en los planes:

- **analizar**: sacar el patrón de una canción.
- **escuchar**: el usuario oye un pedazo para decidir.
- **repartir**: meter cada canción en las categorías con las que encaja.
- **escribir listas**: volcar cada categoría a la lista que lee el reproductor.
- **asignar**: el usuario decide, desde el inbox, a dónde va una canción.

**Categoría**, **muestra**, **excepción**, **inbox** y **umbral** tienen el sentido que les dan
las notas. Si un nombre nuevo hace falta, se propone en el plan y se lleva a las notas.
