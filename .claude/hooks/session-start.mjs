#!/usr/bin/env node
/**
 * Urdimbre — SessionStart hook
 *
 * Inyecta como additionalContext, al arrancar cada sesión y también después de cada compactación
 * de contexto (SessionStart sin matcher se dispara en startup, resume, clear y compact):
 *
 *   1. .claude/memory/MEMORY.md          — índice de la memoria del proyecto
 *   2. spec/constitution/roadmap.md      — el tablero (corto)
 *   3. el bloque «Dónde vamos» de cada plan en curso o aprobado (spec/planes/NNN-…/plan.md)
 *
 * El tercero es el que hace posible retomar: el contexto se vacía, el archivo no. Sin esto,
 * "sé dónde quedó el proyecto" dependería de que el agente decida leer un párrafo — sin garantía.
 *
 * Es `.mjs` a propósito: el package.json del repo es `"type": "module"`, así que un `.js` con
 * `require` revienta antes de la primera línea (así estuvo, sin correr, hasta el 30 ago 2026).
 *
 * No falla nunca: si un archivo no existe, lo omite en silencio (un hook que revienta bloquea el
 * arranque de la sesión).
 */

import fs from "node:fs";
import path from "node:path";

// El hook corre desde la raíz del proyecto (cwd lo fija Claude Code).
const ROOT = process.cwd();

const SOURCES = [
  { label: "Memoria del proyecto (MEMORY.md)", file: path.join(".claude", "memory", "MEMORY.md") },
  { label: "Estado del proyecto (roadmap.md)", file: path.join("spec", "constitution", "roadmap.md") },
];

// Estados de plan cuyo «Dónde vamos» vale la pena cargar. «borrador» y «hecho» no: uno todavía no
// arranca y el otro ya cerró.
const ESTADOS_VIVOS = ["en curso", "aprobado"];

function read(rel) {
  try {
    return fs.readFileSync(path.join(ROOT, rel), "utf8").trim();
  } catch {
    return null;
  }
}

/** Devuelve el estado declarado en la cabecera (`**Estado:** en curso …`) o null. */
function estadoDe(plan) {
  const m = plan.match(/^\*\*Estado:\*\*\s*([^\n·]+)/m);
  return m ? m[1].trim().toLowerCase() : null;
}

/** Recorta el bloque «## Dónde vamos» hasta el siguiente encabezado de nivel 2. */
function dondeVamosDe(plan) {
  const inicio = plan.search(/^## Dónde vamos\s*$/m);
  if (inicio < 0) return null;
  const resto = plan.slice(inicio);
  const fin = resto.slice(1).search(/^## /m);
  return (fin < 0 ? resto : resto.slice(0, fin + 1)).trim();
}

function planesVivos() {
  const dir = path.join(ROOT, "spec", "planes");
  let carpetas;
  try {
    carpetas = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const vivos = [];
  for (const d of carpetas) {
    if (!d.isDirectory() || d.name.startsWith("NNN")) continue;
    const plan = read(path.join("spec", "planes", d.name, "plan.md"));
    if (!plan) continue;
    const estado = estadoDe(plan);
    if (!estado || !ESTADOS_VIVOS.some((e) => estado.startsWith(e))) continue;
    const bloque = dondeVamosDe(plan);
    vivos.push(
      `### Plan ${d.name} — ${estado}\n\n` +
        (bloque ?? "_(sin bloque «Dónde vamos»; añádelo antes de seguir)_") +
        `\n\nArchivo: spec/planes/${d.name}/plan.md`
    );
  }
  return vivos;
}

const blocks = [];
for (const { label, file } of SOURCES) {
  const body = read(file);
  if (body) blocks.push(`### ${label}\n\n${body}`);
}

const vivos = planesVivos();
if (vivos.length > 0) {
  blocks.push(
    "### Planes en curso — «Dónde vamos»\n\n" +
      "Retoma desde «Siguiente». Al cerrar cada paso, actualiza este bloque en el archivo (workflow.md §7).\n\n" +
      vivos.join("\n\n")
  );
}

if (blocks.length === 0) process.exit(0);

const additionalContext = [
  "Contexto cargado por Urdimbre (memoria + roadmap + planes en curso). Se vuelve a cargar tras cada compactación.",
  "Consúltalo antes de diseñar; aliméntalo al cerrar (ver .claude/rules/workflow.md §5, §7).",
  "",
  blocks.join("\n\n---\n\n"),
].join("\n");

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext,
    },
  })
);
