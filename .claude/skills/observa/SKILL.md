---
name: observa
description: "Observa una señal EN VIVO (logs, navegador, métricas, tests en watch) y reacciona a cada evento — loop cerrado contra la realidad, no una sola pasada. Úsalo cuando el humano dice 'quédate viendo los logs', 'yo pruebo la UI y tú reaccionas', 'obsérvalo en vivo', o cuando quieras auto-corregir contra una señal real hasta cumplir un criterio. NO es /verifica (esa es una sola vuelta cerrada a mano)."
---

# Observa — cierra el loop contra la realidad

`/verifica` ejerce el camino real **una vez**. `/observa` mantiene el loop **abierto y vivo**:
el agente se suscribe a una señal real, y cada vez que esa señal cambia, **reacciona**.
La realidad —no una suposición— maneja el siguiente paso.

> Regla única: **suscríbete a una señal real y reacciona a sus eventos, hasta cumplir un criterio
> de parada explícito.** Sin criterio de parada, no arranques: un loop sin meta converge a cualquier cosa.

Hay dos modos. Decide cuál antes de empezar y dilo en una línea.

- **Co-piloto (human-in-the-loop):** el humano actúa en el mundo (clic en la UI, manda un request,
  dispara un evento) y tú observas el rastro (logs, consola del browser, respuesta). Tú no actúas
  sobre el mundo; reaccionas a lo que él provoca: diagnosticas, arreglas, le dices qué probar después.
- **Autónomo (self-driving):** tú actúas *y* observas tu propio output, y te corriges solo hasta
  cumplir el criterio. Es el patrón "loop-until-done". Poderoso y peligroso: exige el guard del Paso 4.

## Paso 1 — Define la señal y el criterio de parada

Antes de levantar nada, fija las dos cosas que vuelven sano al loop:

- **Señal:** ¿qué vas a observar, en concreto? Logs de un proceso (`npm run dev`), consola del navegador,
  un test en watch, métricas de Grafana, la salida de un job. Una señal real, no "la sensación de que sirve".
- **Criterio de parada:** ¿cómo se ve "listo" y cómo se ve "ríndete"? Ej.: "el flujo X no tira errores en 3
  intentos seguidos" / "todos los tests verdes" / "el humano dice basta" / "5 iteraciones sin progreso → paro
  y reporto". Escríbelo. Es lo que evita el desastre del agente que 'arregla' un bug **revirtiendo la feature**.

## Paso 2 — Levanta la señal en segundo plano

Arranca el proceso que emite la señal en background (no bloquees el loop):

- Logs / dev server / tests-watch → corre el comando en segundo plano y suscríbete a su salida.
- Navegador → Playwright: navega a la app real; lee consola, red y snapshot tras cada acción.
- Producción → MCP de observabilidad (Grafana/Loki/Prometheus): consulta la métrica/log real.

Mapea el contexto real primero (CLAUDE.md §1): no reacciones a un log que no entiendes —ten a la mano
qué archivo lo emite y qué significa— antes de tocar nada.

## Paso 3 — El loop: evento → reacción

Por cada evento nuevo en la señal:

1. **Lee el evento de verdad** (el error completo, el stack, el status, el diff de la métrica). No el resumen.
2. **Decide:** ¿es ruido esperado, progreso, o un fallo que actuar?
3. **Co-piloto:** diagnostica y, si procede, arregla; luego dile al humano la **siguiente acción concreta**
   a probar ("ahora dale al botón de guardar con el campo vacío"). **Autónomo:** aplica el fix y vuelve a
   ejercer el path tú mismo.
4. **Vuelve a observar.** La corrección no está confirmada hasta que la señal lo muestre.

Si algo te sorprende y lo arreglas, documéntalo en el instante (CLAUDE.md §5), no al cierre.

## Paso 4 — El guard (sobre todo en modo autónomo)

Un loop autónomo sin freno se va por el barranco. Obligatorio:

- **Cuenta iteraciones sin progreso.** Si N seguidas no mueven la aguja hacia el criterio, **detente y
  reporta** — no sigas "intentando cosas". El humano decide.
- **No cambies la definición de éxito para ganar.** Si te ves tentado a revertir, ensanchar el alcance o
  borrar el test para que "pase", eso es señal de PARAR, no de seguir. Reporta el bloqueo tal cual.
- **Respeta el tier (§2).** Si el loop empieza a tocar dinero/auth/datos/migración, sal del modo autónomo
  y pásalo a co-piloto: que un humano apruebe cada acción con efecto.

## Paso 5 — Cierre

- Reporta en una línea: **qué señal observaste, cuántas vueltas, cómo se cumplió (o no) el criterio.**
- Si convergió: el loop ya *es* tu verificación de comportamiento; aun así, en CRÍTICO corre `/adversarial-review`.
- Si NO convergió: dilo claro, con la última señal observada. Un loop que paró por el guard **no es un fracaso**:
  es el guard haciendo su trabajo.
- Baja los procesos en segundo plano que levantaste. No dejes dev servers colgados.

## Lo que NO es esto

- No es `/verifica` (una sola vuelta, cerrada a mano por el humano). `/observa` es N vueltas vivas.
- No es `/bucle-agentico` (eso fasea *construir* una feature; esto cierra el loop *contra una señal* mientras
  pruebas o corriges). Se complementan: puedes usar `/observa` dentro de una fase para validar en vivo.
- No es autonomía sin red. Sin criterio de parada y sin el guard del Paso 4, no es `/observa`: es un agente
  suelto, y eso lo tenemos prohibido.
