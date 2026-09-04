---
description: "Abre Visual Studio Code en la raíz del proyecto actual."
---

# /vscode

Abre **VSCode** en la carpeta del repo donde estás trabajando, para editar a mano o ver el árbol.

## Qué hacer

1. Resuelve la raíz del repo con `git rev-parse --show-toplevel`. Si no es un repo git,
   usa el directorio actual.
2. Ábrelo:
   ```powershell
   code '<raíz>'
   ```
3. Confirma en una línea.

> Esto es para edición manual puntual, no para correr el agente: Claude Code ya corre en esta
> terminal. Abrir VSCode "para todo" reintroduce justo la RAM que el diseño quería evitar.
