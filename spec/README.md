# spec/ — constitución y planes

> La **urdimbre** del proyecto: primero se tensa el plan, luego se teje el código. Todo cambio
> grande pasa por aquí (qué cuenta como grande: `.claude/rules/workflow.md` §2, pregunta A). Los
> cambios directos (un bug, un texto, un rename) no: se hacen y ya.

## Estructura

```
spec/
├── constitution/            ← el contrato del proyecto (cambia poco)
│   ├── mission.md           ← qué construimos y para quién
│   ├── tech-stack.md        ← tecnologías, convenciones y límites duros
│   └── roadmap.md           ← el tablero: en curso · siguiente · después · hecho (corto, para quien no lee)
└── planes/                  ← una carpeta por plan
    └── NNN-nombre-del-plan/
        ├── resumen.md       ← media página para el humano: qué vas a ver, qué toca, cómo lo compruebas
        ├── plan.md          ← todo lo demás, para el agente: cabecera, «Dónde vamos», contexto, pasos, decisiones
        └── …                ← lo que el plan necesite: historias que pasó el humano, notas, esquemas
```

Dos archivos y no uno, a propósito: el humano aprueba `resumen.md` sin abrir `plan.md`. Si fueran
uno solo, el muro de texto cansa antes de llegar a la primera línea.

**Lo reutilizable no vive en la carpeta del plan.** La ficha de una API o de un sistema externo
(endpoints, límites, formatos) va en `docs/apis/<servicio>.md`, con su línea en `docs/_indice.md`,
porque otro plan la va a volver a usar. El plan la enlaza desde su cabecera (`Docs:`); no la copia.

## Al arrancar el proyecto (una vez)

Rellena `constitution/` — misión, tech-stack, roadmap. Sin constitución no hay planes: es la
referencia que ningún plan puede contradecir. Sustituye todo lo que esté entre `<…>` y borra las
notas en _cursiva_. Al clonar el esqueleto para un cliente, `mission.md` y el roadmap se
reescriben; los planes del chasis (001–005) se quedan como historia: explican por qué el código es
como es.

## El ciclo de un plan

1. **Recibe el contexto.** El humano dice qué quiere y pasa lo que tenga (funcionalidad, historias
   de usuario, especificaciones, documentos) sin redactarlo técnico. Lo largo se guarda dentro de la
   carpeta del plan y se enlaza desde «Contexto».
2. **Mapea el código real** antes de escribir: qué módulos toca, qué planes lo preceden
   (`Depende de:`), qué doc de `docs/` aplica. Si algo choca con la constitución, párate y dilo.
3. **Crea** `planes/NNN-nombre-del-plan/` con el siguiente número libre, copiando las dos plantillas
   de `NNN-nombre-del-plan/`. Si dos sesiones chocan en el número, renombra el tuyo.
4. **Escribe `plan.md` completo** (cabecera, contexto, enfoque, pasos con su tier y sus tests,
   decisiones, riesgos, fuera de alcance) y **después `resumen.md`** a partir de él: media página,
   sin jerga. Si equivocarse cuesta caro, pásale `/premortem` al plan antes de enseñarlo.
5. **Pide el OK sobre `resumen.md`.** Enséñaselo al humano; no lo mandes a leer `plan.md`. Sus
   preguntas se contestan corto y directo. Con el OK: `Estado: aprobado` y el plan pasa a
   «En curso» en el roadmap.
6. **Ejecuta paso a paso,** cada uno con la ceremonia de su tier (`workflow.md` §2 B). **Al cerrar
   cada paso: márcalo y actualiza «Dónde vamos».** Lo que cambie sobre la marcha va a «Decidido en
   marcha»; si cambia algo de `Expone:`, dilo en voz alta. Al terminar un paso, dile al humano qué
   cambió.
7. **Comprueba los checks de `resumen.md`** y márcalos. Ese es el criterio de terminado, no «compila».
8. **Cierra:** `Estado: hecho` en los dos archivos, roadmap a «Hecho» con fecha en una línea, y
   revisa que lo que un humano configura a mano ya esté en `PUESTA-EN-PRODUCCION.md` (se anota al
   aparecer; aquí solo se verifica). Guarda lo que costó caro (`workflow.md` §5).

**Retomar** (sesión nueva, terminal cerrada, contexto vaciado): el hook de inicio inyecta el roadmap
y el «Dónde vamos» de cada plan en curso. Lee «Siguiente» y continúa. No vuelvas a derivar lo que
ya está decidido.

**Estados de un plan:** `borrador` (escrito, sin OK) → `aprobado` (OK al resumen, sin empezar) →
`en curso` → `hecho`. Un plan que se descarta queda `abandonado` con una línea que diga por qué; no
se borra.

> **La constitución manda.** Si un plan choca con `mission.md` o `tech-stack.md`, se replantea el
> plan, no la constitución.
