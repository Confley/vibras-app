# Urdimbre — núcleo del harness

> En un telar, la **urdimbre** son los hilos que se tensan y ordenan _antes_ de tejer; toda la tela
> se construye sobre ellos. Aquí la urdimbre es la **constitución + el plan**: el plan se tensa
> primero y el código se teje encima. **Urdir** también es planear. Ese es el trato: no se teje sin urdimbre.

Este archivo es el sistema operativo del agente: **cómo trabajas**. Es corto a propósito.
El **qué** del proyecto (misión, stack, planes) NO va aquí — vive en `spec/`. Los aprendizajes
del proyecto viven en `.claude/memory/`. Aquí solo va el método.

Urdimbre fusiona dos ejes que no compiten:

- **Planeación (con plan escrito):** todo cambio grande nace de un plan antes de tocar código. El humano
  aprueba media página (`resumen.md`); el agente lleva el resto (`plan.md`), que es también la memoria
  que sobrevive al contexto. La constitución manda.
- **Ejecución (graduada por riesgo):** cada cambio se ejecuta con la ceremonia que su riesgo merece. **Velocidad por defecto, rigor donde el error cuesta caro.**

---

## 1. Filosofía: agent-first

- El humano dice **QUÉ** quiere. Tú decides **CÓMO** y lo ejecutas.
- **No** le pidas al humano que corra comandos ni que edite archivos. Tú lo haces; él aprueba.
- Antes de construir, **mapea el contexto real** (lee el código, pega a la API real, revisa la DB).
  Nunca "supongo y construyo". La mayoría de los errores nacen de una suposición no verificada.
- Si no estás seguro al 80%, **pregunta**. No inventes. (Si la duda es de fondo → pregunta en el plan (o al humano) antes de suponer.)
- Cada error que arreglas se **documenta una vez** para que no vuelva a pasar (ver §5).

---

## 2. La regla única: dos preguntas antes de actuar

Antes de tocar nada, responde dos cosas. La primera decide **si hay plan**; la segunda, **cuánta verificación**.

### Pregunta A — ¿Lleva plan o va directo? → decide el CARRIL

| Es…          | Cuándo                                                                                                                                                                                                                       | Carril                                                                                                                                                              |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CON PLAN** | Cumple **una** de estas: toca dos o más sistemas (almacenamiento del teléfono, análisis de audio, listas del reproductor, permisos del sistema, servicio en segundo plano); no se cierra en una sesión; otro trabajo va a depender de él; o alguna de sus partes es tier CRÍTICO | **Carril con plan:** carpeta `spec/planes/NNN-…/` con `resumen.md` (lo aprueba el humano) y `plan.md` (lo lleva el agente) **antes** de código. Ver `spec/README.md`. |
| **DIRECTO**  | Lo demás: un bug, un texto, un rename, una función, un endpoint sin efectos, un ajuste de config, un refactor local                                                                                                         | **Carril directo:** al grano, sin plan.                                                                                                                             |

> **El plan no es ceremonia: es la memoria que sobrevive al contexto.** Sirve para retomar tras un
> corte y para que el plan que dependa de este sepa qué contrato esperar. Pero exigir plan para
> corregir una errata sería el mismo teatro que el rigor evita: eso va directo. Si dudas, plan
> (sube el carril).

### Pregunta B — ¿Qué riesgo tiene este cambio? → decide la CEREMONIA DE EJECUCIÓN

Vale para **ambos carriles**: para cada paso de un plan y para cada cambio directo. Clasifica el
cambio concreto que estás por hacer. **Si dudas entre dos tiers, sube uno.**

| Tier         | Qué es                                                                                | Ceremonia de ejecución                                                                                       |
| ------------ | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **TRIVIAL**  | Copy, bump, comentario, rename, formato                                               | Hazlo. Punto.                                                                                                |
| **SIMPLE**   | 1 archivo, bug aislado, una función, un endpoint sin efectos                          | Hazlo + valida (`typecheck`/`build`/correr lo afectado). Si hay tests que cubren lo que tocaste, correrlos no es opcional. |
| **MODERADO** | Toca varias capas/archivos, integración nueva                                         | Ejecuta mapeando **contexto real** antes de cada paso. Valida de punta a punta.                             |
| **CRÍTICO**  | Dinero, auth, datos de usuario, migraciones, contratos externos, borrado masivo, prod; escribir o borrar en la carpeta del reproductor; cualquier acceso a archivos de música que no sea lectura | **`/verifica`** (ejerce el path REAL) + **`/adversarial-review`** (sesión aparte) + `/que-guardar`.          |

**El 80% de los cambios es TRIVIAL/SIMPLE.** Ahí ganas velocidad. La ceremonia cara (verifica +
adversarial) **solo** se gasta en CRÍTICO. No infles tiers "por si acaso": esa es la trampa que
vuelve lento a cualquier harness.

**Hazlo visible.** Antes de un cambio no-trivial, declara carril + tier en una línea, con su porqué:
`Plan 004 · paso 3/5 · Tier CRÍTICO — toca migración de saldos.` · `Directo · SIMPLE — 1 archivo, sin dinero/auth.`
El porqué es lo que el humano audita; una etiqueta sin justificación es teatro. TRIVIAL no necesita declaración.

---

## 3. Decision tree: request → acción

| El humano dice…                               | Tú haces                                                                                        |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| "Quiero empezar un proyecto nuevo"            | Llena `spec/constitution/` (misión + tech-stack + roadmap). Sin constitución no hay planes.     |
| "Agrega/implementa [capacidad nueva]" + contexto (historias, specs, docs) | Si cumple §2 A → CON PLAN: mapea el código, escribe `plan.md`, destila `resumen.md`, pide el OK **sobre el resumen**, ejecuta paso a paso actualizando «Dónde vamos». Ver `spec/README.md`. |
| "Sigamos" / "¿en qué íbamos?" (sesión nueva, terminal cerrada, contexto vaciado) | Lee «Dónde vamos» del plan en curso (el hook lo inyecta) y continúa desde «Siguiente». No re-derives lo ya decidido. |
| (a media construcción el plan cambia)         | Anótalo en «Decidido en marcha». Si cambia algo de `Expone:`, dilo en voz alta: otro plan puede contar con eso. |
| "Arregla este bug" / "cambia este texto"      | DIRECTO, tier por riesgo (SIMPLE casi siempre).                                                  |
| "Refactor grande"                             | Si cumple §2 A, lleva plan. Si no: directo de alto blast radius → MODERADO; si toca dinero/auth/datos/migración → CRÍTICO. |
| "Sube/actualiza esta dependencia"             | Directo: patch aislado → SIMPLE + valida; major o que toca runtime/seguridad/build → MODERADO + `/verifica`. |
| "Hotfix urgente en prod"                      | CRÍTICO, pero **no se salta verifica**: ejerce el path real antes de soltar. El `/adversarial-review` se **difiere** al post-incidente, no bloquea el deploy. Urgente ≠ sin red. |
| "Revierte / rollback esto"                    | Directo + `/verifica` (confirma que el revert **restaura** el estado bueno, no que solo aplicó).  |
| "Revisa / verifica que funcione"              | `/verifica` (ejerce el camino real del usuario, no un mock).                                     |
| "Rómpelo / búscale fallos / revisión a fondo" | `/adversarial-review`.                                                                           |
| "Haz commit / abre PR"                        | `/commit`.                                                                                       |
| "Quédate viendo los logs / la UI en vivo"     | `/observa` (loop cerrado contra una señal real).                                                 |
| (plan/decisión con costo alto de equivocarse) | `/premortem` antes de comprometerse.                                                             |
| (el cambio exige configurar algo a mano)      | Anótalo **ya** en `PUESTA-EN-PRODUCCION.md` (§5b): variable, migración, webhook, acceso, bucket. |
| (fin de sesión, algo valió la pena aprender)  | `/que-guardar`.                                                                                  |

Si nada calza, responde las dos preguntas de §2 y procede.

---

## 4. La constitución manda

`spec/constitution/` es el contrato del proyecto — misión, stack, convenciones y límites duros.
Es la fuente de verdad estable; cambia poco.

- **Antes de diseñar cualquier plan, consúltala.** El plan no puede contradecir `tech-stack.md`.
- Si un plan **choca** con `mission.md` o `tech-stack.md`, **párate y dilo**: se replantea el
  plan, **no** la constitución. Cambiar la constitución es una decisión deliberada del humano, nunca
  un default para que "encaje" un cambio.
- La constitución reemplaza al "Golden Path": el stack se decide **una vez** y todo fluye. Cero análisis-parálisis.

---

## 5. Auto-blindaje: el sistema aprende

**Documenta en el instante, no al cierre.** Cuando arregles un fallo no obvio —en el tier que sea, incluso
un bug SIMPLE— escribe la lección en ese momento. El reflejo es: _arreglé algo que me sorprendió → va a
`LESSONS.md` ahora_. `/que-guardar` deja de ser el camino principal y pasa a ser el backstop ("¿quedó algo suelto?").

Guarda cada cosa en su lugar (no como comentario suelto):

- Gotcha transversal (aplica a >1 plan) → `.claude/memory/LESSONS.md` (entrada fechada).
- Anti-patrón / convención no obvia del repo → `.claude/memory/feedback/`.
- Decisión del proyecto que no cabe en ningún plan → `.claude/memory/project/`. (El estado de un
  plan en curso vive en su «Dónde vamos», no aquí.)
- Ficha de una API o sistema externo (endpoints, límites, formatos) → `docs/apis/<servicio>.md` +
  su línea en `docs/_indice.md`. Es documentación que otro plan va a reutilizar, no memoria del agente.
- **Algo que un humano tendrá que configurar a mano para desplegar → `PUESTA-EN-PRODUCCION.md`** (§5b).
- Algo que cambia _cómo trabajas_ (este archivo) → **propónselo al humano**, no lo edites solo.
- Algo que cambia _el qué_ del proyecto (stack, alcance) → va a `spec/`, y lo aprueba el humano.

### 5b · Lo que no cabe en el repo: `PUESTA-EN-PRODUCCION.md`

Hay una clase de conocimiento que no es una lección ni una decisión: **lo que un humano tiene que
hacer fuera del código** para que esto corra en un entorno nuevo. Una variable de entorno nueva, una
migración que hay que aplicar, un webhook que hay que registrar, un bucket que hay que crear, un
permiso que alguien debe conceder. El código no lo puede hacer solo y `git pull` no lo resuelve.

Eso vive en **`PUESTA-EN-PRODUCCION.md`**, en la raíz: una sola lista, en orden de despliegue.

**El reflejo es inmediato, igual que con LESSONS:** en cuanto un paso introduce algo que alguien
tendrá que configurar a mano, **se anota ahí en ese momento** — no al cerrar el plan, no el día
del despliegue. Una variable que nadie registró es una trampa que estalla semanas después, cuando ya
nadie recuerda de dónde salía su valor.

Dos reglas duras:

- **Nunca el valor, siempre el nombre y de dónde sale.** El archivo se versiona y viaja con el clone;
  un secreto ahí es un secreto publicado.
- **Si un paso deja de hacer falta, se borra.** Una lista con pasos muertos deja de leerse.

Filtra sin piedad: si es derivable del código o solo importa a esta conversación, **no lo guardes**.

---

## 6. Reglas de código

- **KISS / YAGNI / DRY.** El código más simple que cumpla. No construyas para un futuro hipotético.
- Escribe código que se lea como el que lo rodea: imita naming, idioma y densidad de comentarios.
- **Nombres que revelan intención.** Los comentarios explican el _porqué_, no el _qué_.
- **Guard clauses / early returns.** Sal temprano de los casos borde; no anides tres niveles de `if`.
- No reescribas archivos enteros sin necesidad; edita lo mínimo.
- **Borra el código muerto; no lo dejes comentado "por si acaso".** Git lo recuerda.
- Errores: nada de `catch` silencioso. Si el dev debe enterarse, que se entere (log/observabilidad). Si el fallback hizo su chamba, un `warn`.
- Valida inputs (UUIDs, longitudes, enums). No confíes en el cliente.
- **Secretos jamás en código, commits ni logs.** Van en variables de entorno / gestor de secretos.
- **Los archivos de secretos (`.env` reales) son del usuario: NUNCA los crees, sobrescribas, borres ni los uses de scratchpad.** Para correr o probar, pasa las variables **inline** al comando o usa un archivo de prueba cuyo nombre **no** empiece con `.env`. El agente solo mantiene `.env.example`. _(Un hook `block-env-read.mjs` lo bloquea de todos modos; la regla existe para que entiendas el porqué.)_
- **Antes de borrar o sobrescribir cualquier archivo, míralo; si no lo creaste tú en esta misma tanda, no lo toques** — pregunta o busca una alternativa no destructiva.
- **Tests existentes son ley.** Si el repo ya tiene suite, un cambio no está "hecho" hasta que la suite afectada pasa. No agregues tests donde no los hay (YAGNI), pero no rompas los que hay.

### Seguridad (siempre, no solo en CRÍTICO)

> Invariantes universales: no tienen tradeoff, aplican a toda app. El modelo de amenaza _específico_
> (PCI/HIPAA, qué es PII en tu negocio, el flujo de auth concreto) va a `spec/constitution/`, no aquí.

- **Nunca mezcles input externo con código.** Parametriza queries; escapa según el contexto (SQL, shell, HTML). Así matas injection (SQLi, command injection, XSS) de raíz.
- **Valida _y_ autoriza en el servidor.** El check del cliente es UX, no seguridad. Verifica permiso en cada request — no asumas que quien llega tiene derecho al recurso (IDOR).
- **No inventes cripto.** Usa libs probadas; hashea passwords con bcrypt/argon2, nunca a mano ni en claro.
- **No filtres en los errores.** Ni stack traces, ni secretos, ni PII al cliente o a logs. Mensaje genérico afuera, detalle a observabilidad.

---

## 7. Memoria y estado

Al inicio de sesión —y otra vez después de cada compactación de contexto— un hook inyecta tres cosas
(ver `settings.json`):

- **`.claude/memory/MEMORY.md`** — índice de la memoria del proyecto (máx ~200 líneas). Vive **en el repo,
  versionada en git**: viaja con el clone, la comparte el equipo, no se pierde. Consúltala antes de diseñar; aliméntala al cerrar (§5).
- **`spec/constitution/roadmap.md`** — el «dónde estás» en 30 segundos: qué está hecho, qué está en
  curso, qué viene. Corto a propósito: lo lee gente que no lee.
- **El bloque «Dónde vamos» de cada plan en curso** — último paso cerrado, siguiente, lo decidido en
  marcha, lo tocado, lo abierto.

**«Dónde vamos» es tu memoria de trabajo; el contexto no lo es.** El contexto se vacía y la terminal se
cierra; el archivo no. Por eso la regla es una y no se negocia: **al cerrar cada paso, antes de empezar
el siguiente, marca el paso y actualiza «Dónde vamos».** Si el corte te agarra a medio paso, el bloque
dice cuál era y qué quedó tocado, y con eso se retoma sin re-derivar nada.

El roadmap lo mantiene el agente al abrir un plan (a «En curso») y al cerrarlo (a «Hecho», con fecha,
en una línea); el humano lo toca solo para cambiar el orden. No hay otro roadmap: este **es** el estado
del proyecto.
