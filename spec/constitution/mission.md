# Misión

_Define la razón de ser del proyecto. Es la referencia que decide si una feature "encaja" o no._

> La lógica completa (entidades, reglas, flujos y decisiones) vive en las notas del autor; ver
> `BUSINESS_LOGIC.md`. Esto es el resumen que cabe en una página. Si chocan, mandan las notas.

## Qué construimos

Una app para Android que **agrupa toda la música del teléfono en listas por la sensación que
transmite cada canción**, sin PC de por medio.

1. **Categorías por muestras.** El usuario crea una categoría y señala cinco canciones de muestra.
   La app saca el patrón de esas muestras y de ahí en más decide sola.
2. **Análisis y reparto en el teléfono.** Cada canción se analiza en segundo plano y entra en
   todas las categorías con las que encaja; repetirse está bien. Las descargas nuevas entran solas.
3. **Inbox para lo que no encaja.** Nada se fuerza. Lo que no cabe en ninguna categoría espera en
   el inbox; el usuario escucha un pedazo y la mete como muestra, como excepción, o abre una
   categoría nueva.
4. **Listas que lee el reproductor de siempre.** Cada categoría se vuelve una lista de
   reproducción en el formato y la carpeta que el reproductor entiende. La música nunca se toca.

## Para quién

- **José, hoy.** Su teléfono, su música, su reproductor. Es el único usuario de la primera versión.
- **Cualquiera, después.** El repo es público desde el primer commit; compartir la app con
  terceros se evalúa cuando la primera versión funcione.

## Principios

- **La música no se toca.** Ni se mueve, ni se renombra, ni se convierte. La app solo lee
  archivos y escribe listas.
- **Nada se fuerza.** Si una canción no encaja, va al inbox; nunca se mete a la categoría «menos
  mala».
- **Todas se agrupan.** La meta es que ninguna canción quede fuera de todas las listas. El inbox
  es una cola de trabajo, no un destino.
- **Las listas las escribe la app, no la mano.** No hay edición manual de listas; lo que se
  corrige es el patrón: muestras, excepciones, umbral.
- **La app reproduce solo para decidir.** No es un reproductor.

## Qué NO es

- No es un reproductor de música ni compite con el que ya usa el usuario.
- No es un editor de listas a mano.
- No convierte, mezcla ni transforma canciones.
- No depende de un servidor ni de una PC.
