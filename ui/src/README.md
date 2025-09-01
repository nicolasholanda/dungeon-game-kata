# Overview do `FE`

- **Framework:** O frontend é feito em **React**
- **Build Tool:** Utiliza **Vite** para desenvolvimento e build.
- **Estilização:** Usa **Tailwind CSS** para estilos utilitários, configurado em `tailwind.config.js` e `index.css`.
- **Componentização:** Os componentes estão em `components`, organizados por função (ex: `DungeonGrid`, `AppShell`, `ui` para componentes reutilizáveis).

---

## Pontos Importantes do Código

### 1. Integração com Backend

- O frontend consome o endpoint `/dungeon/solve` via `fetch` em `App.tsx`:
  - Envia uma matriz em formato JSON.
  - Recebe `{ minimumHP, path }` como resposta.
  - O resultado é exibido visualmente usando `DungeonGrid`.

### 2. Visualização Dinâmica

- `DungeonGrid` mostra a matriz do dungeon, destacando o caminho ótimo e os pontos de início/fim.
- O componente recebe `matrix`, `minimumHP` e `path` como props e renderiza um grid visual.

### 3. Offline e Background Sync

- O frontend possui lógica para lidar com falhas de conexão e sincronização em background:
  - `useBackgroundSync` gerencia requisições pendentes quando offline e tenta reenviá-las quando a conexão volta.

### 4. Componentes Reutilizáveis

- A pasta `ui` contém componentes de interface baseados em Radix UI e outros padrões, como:
  - `Dialog`, `Drawer`, `Sheet`, `Accordion`, `Tabs`, `Popover`, `Tooltip`, `Card`, `Alert`, `Progress`, `Slider`, `Select`, etc.
- Todos seguem o padrão de ForwardRef e são altamente customizáveis via props e classes Tailwind.

### 5. Configuração de Temas e Estilos

- O tema (cores, bordas, etc.) é controlado por variáveis CSS em `index.css` e `tailwind.config.js`.
- Suporte a modo escuro via classe `.dark`.

### 6. PWA e Service Worker

- O projeto é configurado como PWA (Progressive Web App) usando `vite-plugin-pwa`.
- Possui cache de API e imagens, além de background sync para requisições falhas.

### 7. Como rodar o frontend

- Instalar dependências e rodar:
  ```sh
  cd ui
  npm install
  npm run dev
  ```
- Build para produção:
  ```sh
  npm run build && npm run preview
  ```

---

## Arquivos-Chave para Explicação

- `App.tsx`: Lógica principal, integração com backend, visualização.
- `DungeonGrid.tsx`: Visualização do dungeon e caminho.
- `useBackgroundSync.ts`: Sincronização offline/background.
- `ui`: Componentes reutilizáveis.
- `tailwind.config.js` e `index.css`: Configuração de estilos e temas.
- `vite.config.ts`: Configuração de build, PWA, cache.

---

## Recomendações

- Entender como o frontend consome o endpoint `/dungeon/solve` e como espera o formato da resposta.
- Saber explicar como o resultado é exibido visualmente.
- Ter noção de como o frontend lida com falhas de conexão e sincronização.
- Saber que os componentes visuais são altamente reutilizáveis e baseados em padrões modernos de UI.
