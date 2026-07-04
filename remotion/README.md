# Remotion — Vídeos programáticos de Villano Growth

Proyecto de [Remotion](https://www.remotion.dev) para crear vídeos con React:
animaciones para clientes, creatividades de anuncios en vídeo, intros, etc.
Basado en la plantilla oficial *hello-world* de Remotion.

## Comandos

Todos se ejecutan **dentro de esta carpeta** (`remotion/`):

```console
npm install          # instalar dependencias (solo la primera vez)
npm run dev          # abrir Remotion Studio (previsualización en el navegador)
npx remotion render HelloWorld out/video.mp4   # renderizar el vídeo a MP4
npm run lint         # comprobar el código (eslint + TypeScript)
npx remotion upgrade # actualizar Remotion a la última versión
```

## Estructura

```
remotion/
├─ src/
│  ├─ index.ts            ← punto de entrada
│  ├─ Root.tsx            ← registro de composiciones (los "vídeos" disponibles)
│  ├─ HelloWorld.tsx      ← composición de ejemplo
│  └─ HelloWorld/         ← componentes de la composición de ejemplo
├─ remotion.config.ts     ← configuración (formato, navegador, etc.)
└─ package.json
```

Para crear un vídeo nuevo: añade un componente en `src/` y regístralo como
`<Composition>` en `src/Root.tsx`.

## Nota sobre entornos con red restringida

Para renderizar, Remotion descarga su propio *Chrome Headless Shell* desde
`remotion.media`. En sandboxes donde ese host está bloqueado (como Claude Code
en la web), `remotion.config.ts` detecta automáticamente el Chromium de
Playwright preinstalado y lo usa en su lugar. También puedes forzar un binario
concreto con la variable de entorno `REMOTION_BROWSER_EXECUTABLE`. En un
ordenador normal no hay que hacer nada.

## Documentación

- Fundamentos: https://www.remotion.dev/docs/the-fundamentals
- Referencia del CLI: https://www.remotion.dev/docs/cli

## Licencia

Remotion no es 100 % software libre: algunas empresas necesitan una licencia
de pago. Lee los términos en
https://github.com/remotion-dev/remotion/blob/main/LICENSE.md.
