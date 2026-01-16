# Solid vCard Web Component

A lightweight native Web Component that renders a Solid pod vCard profile.

## Install

```bash
npm install @kiliankil/solid-vcard-card
```

or load directly from a CDN (skypack/jsdelivr/unpkg) in the browser.

## Use

```html
<script type="module">
  import '@kiliankil/solid-vcard-card';
</script>

<solid-vcard-card profile="https://example.org/profile/card#me"></solid-vcard-card>
```

### Attributes
- `profile` (required): Full URL of the vCard resource in the Solid pod.

### Using with Vue / Nuxt

This package is a native Web Component. In Vue, you should:
- Import the package for its side effect (it registers the custom element in the browser), and
- Use the kebab-case tag `<solid-vcard-card>` directly in your templates.

Do not import `{ SolidVCardCard }` as a Vue component or register it in `components: { ... }`. Doing so makes Vue try to call the class constructor as a function and leads to the error: "class constructors must be invoked with 'new'".

#### Vue 3 (Vite)

1) Import once at app startup (client):

```ts
// main.ts or main.js
import { createApp } from 'vue';
import App from './App.vue';

import '@kiliankil/solid-vcard-card'; // registers <solid-vcard-card> in the browser

const app = createApp(App);
// Optional: silence unknown element warning by telling Vue it's a custom element
app.config.compilerOptions.isCustomElement = (tag) => tag === 'solid-vcard-card';
app.mount('#app');
```

2) Use the tag in any component template:

```vue
<template>
  <solid-vcard-card profile="https://example.org/profile/card#me" />
</template>
```

If you prefer configuring in Vite instead of at runtime:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'solid-vcard-card',
        },
      },
    }),
  ],
});
```

#### Nuxt 3

1) Create a client-only plugin to load the Web Component in the browser:

```ts
// plugins/solid-vcard-card.client.ts
import '@kiliankil/solid-vcard-card';
```

2) Tell Nuxt/Vue this is a custom element (optional but recommended to silence warnings):

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'solid-vcard-card',
    },
  },
});
```

3) Use the tag in your pages/components:

```vue
<template>
  <solid-vcard-card profile="https://example.org/profile/card#me" />
</template>
```


### What it renders
- Full name (`vcard:fn`)
- Role (`vcard:role`)
- Organization name (`vcard:organization-name`)
- Email (`vcard:hasEmail`)
- Phone (`vcard:hasTelephone`)
- Birthday (`vcard:bday`)
- Photo (`vcard:hasPhoto`)

## Development
- `index.html` contains a simple demo loader.
- Entry point: `index.js` re-exports the component class.
- Source: `src/solid-vcard-card.js`, vocab: `src/rdf/vcard.js`.

## Publish (summary)
1. Update version in `package.json`.
2. `npm publish --access public`

## Notes
- Uses `@inrupt/solid-client` and native Custom Elements.
- No build step required; packaged as pure ESM.
