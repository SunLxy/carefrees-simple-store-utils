import ReactDOM from 'react-dom/client';
import { SimplePreview } from "simple-markdown-preview"
ReactDOM.createRoot(document.getElementById('root')!).render(
  <SimplePreview path={() => import("@carefrees/simple-store-utils/README.md")} />,
);
