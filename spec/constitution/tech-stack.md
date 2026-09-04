# Tech stack y convenciones

_Cómo está construido el proyecto y las reglas que todo el código debe respetar. Es la referencia
técnica que ningún plan debería contradecir._

> **Sin decidir todavía.** No hay código. El stack lo propone el primer plan
> (`spec/planes/001-…`) y el humano lo aprueba en su `resumen.md`; entonces este archivo se
> reescribe con la decisión y sus porqués. Hasta ahí, aquí solo viven las restricciones que la
> lógica de negocio ya fija.

## Restricciones que ya están fijas

Vienen de las notas del autor (ver `BUSINESS_LOGIC.md`); no se discuten en un plan técnico.

- **Corre en un teléfono Android**, sin PC ni servidor. El análisis de audio se hace en el
  teléfono, en segundo plano.
- **La música vive en el almacenamiento del teléfono**, en la carpeta que lee el reproductor
  (hoy `/sdcard/YMusic/`). Tamaño de hoy: unas 1 150 canciones, 24 GB. Hay mezclas de una o dos
  horas que cuentan como canciones normales.
- **El reproductor es YMusic**, y solo lee listas `.m3u8` que estén en su propia carpeta, con la
  ruta absoluta completa de cada archivo. La app escribe ahí; no hay otra vía.
- **La música nunca se modifica**: ni se mueve, ni se renombra, ni se reescribe.
- **La app reproduce audio solo para que el usuario decida** desde el inbox: un pedazo, no un
  reproductor completo.
- **Las descargas nuevas se detectan y se reparten solas**, sin confirmación.

## Qué tiene que responder el primer plan

- Cómo se saca el patrón de una canción en el teléfono y cómo se mide el parecido con las
  muestras de una categoría, con un umbral único ajustable.
- Cuánto tarda y cuánta batería cuesta analizar la biblioteca entera de hoy, y una canción nueva.
- Cómo se detectan descargas nuevas y cómo corre el análisis en segundo plano sin que el sistema
  lo mate.
- Cómo se prueba sin el teléfono y cómo se prueba en el teléfono.

## Convenciones

Se escriben cuando haya stack. Lo que ya aplica sin stack está en `.claude/rules/workflow.md`.
