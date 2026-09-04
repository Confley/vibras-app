---
description: "Abre el explorador de archivos de Windows en la raíz del proyecto actual."
---

# /carpeta

Abre el **explorador de archivos** en la carpeta del repo donde estás trabajando.

## Qué hacer

1. Resuelve la raíz del repo con `git rev-parse --show-toplevel`. Si no es un repo git,
   usa el directorio actual.
2. Ábrelo:
   ```powershell
   Start-Process explorer -ArgumentList '<raíz>'
   ```
3. Confirma en una línea qué carpeta abriste. Es captura de acción, no abras debate.
