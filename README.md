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

