#!/usr/bin/env node
// PreToolUse hook: impide que Claude LEA o ESCRIBA archivos de secretos (.env, .env.prod, etc.).
// Permite los que no llevan secretos: .env.example / .env.sample / .env.template.
// Cubre Read/Edit/Write (por file_path) y comandos de shell —Bash y PowerShell— con lectores
// conocidos (cat, type, Get-Content, Select-String...).
// Prevención de fugas/clobbers accidentales, NO una frontera de seguridad: un comando a medida
// (source, redirección <, node -e) puede rodearlo. La garantía real es no tener secretos de prod en la máquina.

let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let data = {};
  try {
    data = JSON.parse(raw || "{}");
  } catch {
    process.exit(0); // si no podemos parsear, no bloqueamos
  }

  const tool = data.tool_name;
  const input = data.tool_input || {};

  const decision = decide(tool, input);
  if (decision) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: decision,
        },
      })
    );
  }
  process.exit(0);
});

// Devuelve un basename tipo ".env" o ".env.prod" (o "" si no aplica).
function envBasename(p) {
  if (!p) return "";
  const base = String(p).split(/[\\/]/).pop() || "";
  return /^\.env(\.[A-Za-z0-9_.-]+)?$/.test(base) ? base : "";
}

// ¿Es un .env con secretos? (los example/sample/template no lo son)
function isSecretEnv(base) {
  if (!base) return false;
  return !/^\.env\.(example|sample|template|dist)$/.test(base);
}

function decide(tool, input) {
  if (tool === "Read" || tool === "Edit" || tool === "Write") {
    const base = envBasename(input.file_path);
    if (isSecretEnv(base)) {
      const verbo = tool === "Read" ? "Lectura" : "Escritura";
      return `${verbo} bloqueada: "${base}" contiene secretos. Usa .env.example para ver qué variables existen; nunca leas ni sobrescribas los valores reales.`;
    }
    return null;
  }

  // PowerShell va aquí junto a Bash: en Windows es el shell primario del harness, y sin
  // este tool en la condición un `Get-Content .env` pasaba libre por más que el regex de
  // abajo ya nombrara los lectores de PowerShell.
  if (tool === "Bash" || tool === "PowerShell") {
    const cmd = String(input.command || "");
    // Solo bloquea si un LECTOR está adyacente a un .env con secretos en el mismo comando:
    // `cat .env` sí; pero `git commit -m "arregla .env"` no (el reader no está pegado al archivo),
    // y `cp .env.example .env` tampoco (cp no es lector). [^|;&\n] evita cruzar tuberías, ; o saltos
    // de línea, para no asociar el reader de un comando con el .env de otro (p. ej. un heredoc).
    const readerNearEnv =
      /\b(?:cat|less|more|head|tail|bat|strings|xxd|od|nl|tac|Get-Content|gc|type|Select-String|sls|notepad|nano|vim?|code|sed|awk|grep|rg)\b[^|;&\n]*?(\.env(?:\.[A-Za-z0-9_.-]+)?)\b/gi;
    let m;
    while ((m = readerNearEnv.exec(cmd)) !== null) {
      if (isSecretEnv(m[1])) {
        return `Lectura bloqueada: el comando lee un archivo .env con secretos. Nunca imprimas sus valores; consulta .env.example.`;
      }
    }
    return null;
  }

  return null;
}
