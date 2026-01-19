# DevTools - Web Developer Utilities

A collection of essential web development tools built with React, TanStack Router, and Tailwind CSS. All tools run entirely in your browser with a beautiful, modern UI.

## 🚀 Features

### Available Tools

1. **Base64 Encode & Decode**
   - Encode text to Base64
   - Decode Base64 to text
   - URL-safe encoding/decoding
   - Copy to clipboard functionality

2. **JSON Viewer**
   - Format and minify JSON
   - Validate JSON syntax
   - Collapsible JSON tree view
   - Syntax highlighting

3. **JWT Extract**
   - Decode JWT tokens
   - View header and payload
   - Pretty-printed JSON output
   - Extract token information

4. **Image Converter**
   - Convert images to WebP, PNG, or JPG
   - Adjust quality and scale
   - Drag and drop support
   - Batch conversion with ZIP download
   - Client-side processing (no uploads)

5. **OG, Meta & SEO Viewer**
   - Analyze Open Graph tags
   - View meta tags and SEO information
   - Twitter Card tags
   - OG image preview
   - Server-side fetching (no CORS issues)

## 🛠️ Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React + SSR)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd devtools
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Building for Production

To build the application for production:

```bash
pnpm build
```

To preview the production build:

```bash
pnpm preview
```

## 📁 Project Structure

```
src/
├── routes/
│   ├── index.tsx              # Home page with tool menu
│   ├── tools/
│   │   ├── base64.tsx         # Base64 encode/decode tool
│   │   ├── json-viewer.tsx    # JSON viewer and formatter
│   │   ├── jwt-extract.tsx    # JWT token decoder
│   │   ├── image-converter.tsx # Image conversion tool
│   │   └── og-meta-seo-viewer.tsx # SEO tag analyzer
│   └── __root.tsx             # Root layout with header
├── components/
│   ├── Header.tsx             # Navigation header
│   ├── json-tree.tsx          # Collapsible JSON tree component
│   └── ui/                    # shadcn/ui components
└── lib/
    └── seo-analyzer.ts         # Server-side SEO analysis API
```

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) for UI components. To add new components:

```bash
pnpm dlx shadcn@latest add <component-name>
```

For example:
```bash
pnpm dlx shadcn@latest add button
```

## 🧪 Testing

This project uses [Vitest](https://vitest.dev/) for testing. Run tests with:

```bash
pnpm test
```

## 🔍 Linting & Formatting

This project uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for code quality.

Available scripts:
```bash
pnpm lint      # Run ESLint
pnpm format    # Format code with Prettier
pnpm check     # Format and lint (prettier --write . && eslint --fix)
```

## 🌐 Environment Variables

This project uses [T3Env](https://env.t3.gg/) for type-safe environment variables.

1. Add environment variables to `src/env.mjs`
2. Use them in your code:

```ts
import { env } from "@/env";

console.log(env.VITE_APP_TITLE);
```

## 🛣️ Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are automatically generated from files in the `src/routes` directory.

### Adding a New Route

Simply create a new file in `src/routes`:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/my-route')({
  component: MyComponent,
})
```

### Navigation

Use the `Link` component for navigation:

```tsx
import { Link } from '@tanstack/react-router'

<Link to="/tools/base64">Base64 Tool</Link>
```

## 🎯 Usage Examples

### Base64 Encode/Decode
1. Navigate to `/tools/base64`
2. Enter text in the input field
3. Click "Encode" or "Decode"
4. Copy the result to clipboard

### JSON Viewer
1. Navigate to `/tools/json-viewer`
2. Paste your JSON in the input field
3. Click "Format" to prettify or "Minify" to compress
4. View the collapsible tree structure on the right

### JWT Extract
1. Navigate to `/tools/jwt-extract`
2. Paste your JWT token
3. View the decoded header and payload

### Image Converter
1. Navigate to `/tools/image-converter`
2. Drag and drop images or click to select
3. Adjust quality and scale settings
4. Choose output format (WebP, PNG, JPG)
5. Download individual images or as a ZIP

### SEO Viewer
1. Navigate to `/tools/og-meta-seo-viewer`
2. Enter a URL (with or without protocol)
3. Click "Analyze"
4. View all meta tags, OG tags, and SEO information

## 🚀 Deployment

This project can be deployed to any platform that supports Node.js:

- **Vercel**: Connect your repository and deploy
- **Netlify**: Use the build command `pnpm build`
- **Cloudflare Pages**: Configure build settings
- **Self-hosted**: Run `pnpm build` and serve the output

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📚 Learn More

- [TanStack Documentation](https://tanstack.com)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Start](https://tanstack.com/start)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

---

Built with ❤️ using TanStack Start
