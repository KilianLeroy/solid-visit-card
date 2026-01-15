class SolidBusinessCard extends HTMLElement {
    static get observedAttributes() {
        return ['profile'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        if (this.getAttribute('profile')) {
            this.loadProfile(this.getAttribute('profile'));
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'profile' && newValue) {
            this.loadProfile(newValue);
        }
    }

    async loadProfile(profileUrl) {
        this.shadowRoot.innerHTML = `<p>Loading…</p>`;

        try {
            const response = await fetch(profileUrl, {
                headers: { Accept: 'text/turtle, application/ld+json' }
            });

            if (!response.ok) throw new Error('Profile not found');

            const text = await response.text();

            // (voorlopig mock parsing)
            this.render({
                name: 'John Doe',
                role: 'Web Developer',
                organisation: 'Solid Project'
            });
        } catch (err) {
            this.shadowRoot.innerHTML = `<p>Error loading profile</p>`;
        }
    }

    render({ name, role, organisation }) {
        this.shadowRoot.innerHTML = `
      <style>
        .card {
          border: 1px solid #ccc;
          padding: 1rem;
          border-radius: 8px;
          font-family: sans-serif;
        }
        h2 { margin: 0; }
      </style>

      <div class="card">
        <h2>${name}</h2>
        <p>${role}</p>
        <small>${organisation}</small>
      </div>
    `;
    }
}

customElements.define('solid-business-card', SolidBusinessCard);
