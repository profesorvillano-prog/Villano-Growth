# Cómo crear el repo de un cliente nuevo (paso a paso)

Sigue estos pasos cada vez que des de alta a un cliente. Tarda 2 minutos.

## 1. Crea el repositorio en GitHub
1. Entra en https://github.com/new (con tu cuenta `profesorvillano-prog`).
2. **Repository name:** el nombre del cliente, por ejemplo `marcelo-dachshund`
   (sin espacios; usa guiones).
3. Marca **Private** (privado, recomendado para clientes).
4. Pulsa **Create repository**.

## 2. Copia la plantilla dentro de ese repo
Copia el contenido de esta carpeta `plantilla-cliente/` al nuevo repo:
- El archivo **`.claude/settings.json`** (es el que conecta las skills). Déjalo igual.
- El **`README.md`** (cámbiale el nombre del cliente arriba).

> Si trabajas en Claude Code, lo más fácil es decirle:
> *"copia la plantilla-cliente de marketingskills a este repo"* y listo.

## 3. Abre el repo del cliente en Claude Code
Al abrirlo, las skills de tu biblioteca se cargan solas.
Pruébalo escribiendo, por ejemplo, `/impeccable polish`.

---

### ¿Y si no se cargan solas?
Escribe estos dos comandos una vez en ese proyecto:

```
/plugin marketplace add profesorvillano-prog/Villano-Growth
/plugin install impeccable@marketingskills
```
