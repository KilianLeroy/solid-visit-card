/**
 * Profile data interface for the vCard
 */
export interface VCardProfile {
    name: string;
    role?: string;
    org?: string;
    email?: string;
    phone?: string;
    birthday?: string;
    photo?: string;
}

/**
 * SolidVCardCard - A native Web Component that renders a Solid pod vCard profile
 *
 * @example
 * ```html
 * <script type="module">
 *   import '@kiliankil/solid-vcard-card';
 * </script>
 *
 * <solid-vcard-card profile="https://example.org/profile/card#me"></solid-vcard-card>
 * ```
 */
export class SolidVCardCard extends HTMLElement {
    /**
     * List of observed attributes for the component
     */
    static observedAttributes: string[];

    /**
     * The loaded vCard profile data
     */
    _profile?: VCardProfile;

    /**
     * Creates a new SolidVCardCard instance
     */
    constructor();

    /**
     * Lifecycle callback called when the element is inserted into the DOM
     */
    connectedCallback(): void;

    /**
     * Lifecycle callback called when observed attributes change
     */
    attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null): void;

    /**
     * Loads and renders a vCard profile from a Solid pod
     * @param profileUrl - The full URL of the vCard resource
     */
    load(profileUrl: string): Promise<void>;

    /**
     * Renders the vCard profile with styling
     * @param profile - The profile data to render
     */
    render(profile: VCardProfile): void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'solid-vcard-card': {
                profile?: string;
                [key: string]: any;
            };
        }
    }
}

