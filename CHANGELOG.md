# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] - 2026-01-15
### Changed
- Fixed wrong git urls

## [1.2.0] - 2026-01-15

### Added
- SSR compatibility for Nuxt.js and other server-side rendering frameworks
- Browser environment detection to prevent `HTMLElement is not defined` errors

### Changed
- Component class is now conditionally defined based on environment
- Stub class exported for SSR environments to prevent initialization errors

## [1.0.0] - 2026-01-15

### Added
- Initial release
- Native Web Component that renders Solid vCard profiles
- Support for vCard properties: name, role, organization, email, phone, birthday, photo
- TypeScript definitions
- XSS protection with HTML escaping
- Responsive design with elegant styling
- Support for both direct and referenced email/phone values
- Automatic profile detection in Solid datasets
- Shadow DOM encapsulation for style isolation

