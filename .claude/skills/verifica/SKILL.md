---
name: verifica
description: "Confirmar que un cambio hace lo que debe ejerciendo el CAMINO REAL del usuario, no un mock ni 'compila'. Úsalo en cambios CRÍTICOS o cuando el humano pide 'verifica que funcione'. Es ligero: una regla, no una checklist de 50 pasos."
---

# Verifica — ejerce el camino real

Verificar no es "el typecheck pasó". Es **reproducir lo que el usuario hará** y observar el resultado.
Un render mockeado, un test con datos falsos o un "debería funcionar" NO son verificación.

> Regla única: **ejerce el path real de punta a punta. Si no lo ejerciste, no está verificado.**

## Proceso

1. **Define el camino real.** ¿Qué hace el usuario, paso a paso, para tocar este cambio?
   (request HTTP concreto, click en la UI real, mensaje entrante real, job encolado real…)

2. **Prepara el estado real.** Datos de prueba reales en la DB/servicio, no stubs. Servidor corriendo.

3. **Ejecútalo de verdad.** Elige la herramienta según la capa:
   - API → `curl`/cliente HTTP contra el endpoint real, mira la respuesta y el efecto en DB.
   - UI → navegador real (Playwright): navega, llena, click, y **observa** el resultado, no solo el render.
   - Async (queue/webhook) → dispara el evento real y sigue el job hasta su efecto.
   - Migración → córrela y verifica el schema/datos resultantes.

   Si el repo tiene tests automatizados del área tocada, córrelos como parte de ejercer el camino real
   (complementan, no reemplazan, ejercer el path real).

4. **Compara contra la intención**, no contra "no crasheó". ¿El efecto observable es el esperado?
   Revisa también un caso negativo obvio (input inválido, vacío, permiso ajeno).

5. **Restaura** si tu verificación creó o mutó datos (borra el registro de prueba, deja el estado limpio).

## Salida

Reporta en una línea por path: **qué ejerciste, qué observaste, pasó/falló**.
Si falló, NO lo marques como hecho: vuelve al fix (y documenta el gotcha si es transversal).

## Lo que NO es esto

No es la ceremonia de specboot (reports datados por cada substep, restore-DB obligatorio formal).
Es la versión mínima viable: ejercer lo real. Si necesitas un adversario que intente *romperlo*,
eso es `/adversarial-review`, no esto.
