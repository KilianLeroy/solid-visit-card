import {
    getSolidDataset,
    getThing,
    getThingAll,
    getStringNoLocale,
    getUrl
} from '@inrupt/solid-client';

import { VCARD } from './rdf/vcard.js';

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export class SolidVCardCard extends HTMLElement {
    static observedAttributes = ['profile'];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    // noinspection JSUnusedGlobalSymbols
    connectedCallback() {
        const profile = this.getAttribute('profile');
        if (profile) {
            this.load(profile);
        } else {
            this.shadowRoot.innerHTML = `<p>No profile URL provided</p>`;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'profile' && newVal !== oldVal) {
            this.load(newVal);
        }
    }

    async load(profileUrl) {
        this.shadowRoot.innerHTML = `<p>Loading vCard…</p>`;

        try {
            const dataset = await getSolidDataset(profileUrl.trim());
            let thingUrl = profileUrl.trim();

            if (!thingUrl.includes('#')) {
                const candidate = thingUrl.endsWith('#') ? thingUrl + 'me' : thingUrl + '#me';
                const maybe = getThing(dataset, candidate);
                if (maybe) thingUrl = candidate;
            }

            let profileThing = getThing(dataset, thingUrl);

            if (!profileThing) {
                const things = getThingAll(dataset);
                for (const thing of things) {
                    const name = getStringNoLocale(thing, VCARD.fn);
                    if (name) { profileThing = thing; break; }
                }
            }

            if (!profileThing) {
                this.shadowRoot.innerHTML = `<p>No profile found in dataset</p>`;
                return;
            }

            const name = getStringNoLocale(profileThing, VCARD.fn) || 'Unknown';
            const role = getStringNoLocale(profileThing, VCARD.role) || '';
            const org = getStringNoLocale(profileThing, VCARD.organization_name) || '';

            // Email may be a direct mailto: URL or a node with vcard:value
            let email = '';
            const emailNodeUrl = getUrl(profileThing, VCARD.hasEmail);
            if (emailNodeUrl) {
                if (emailNodeUrl.startsWith('mailto:')) {
                    email = emailNodeUrl.replace('mailto:', '');
                } else {
                    const emailThing = getThing(dataset, emailNodeUrl);
                    const emailValue = emailThing ? getUrl(emailThing, VCARD.value) : null;
                    if (emailValue && emailValue.startsWith('mailto:')) {
                        email = emailValue.replace('mailto:', '');
                    }
                }
            }

            const birthday = getStringNoLocale(profileThing, VCARD.bday) || '';
            const photo = getUrl(profileThing, VCARD.hasPhoto) || '';

            // Phone may be a direct tel: URL or a node with vcard:value
            let phone = '';
            const phoneNodeUrl = getUrl(profileThing, VCARD.hasTelephone);
            if (phoneNodeUrl) {
                if (phoneNodeUrl.startsWith('tel:')) {
                    phone = phoneNodeUrl.replace('tel:', '');
                } else {
                    const phoneThing = getThing(dataset, phoneNodeUrl);
                    const phoneValue = phoneThing ? getUrl(phoneThing, VCARD.value) : null;
                    if (phoneValue && phoneValue.startsWith('tel:')) {
                        phone = phoneValue.replace('tel:', '');
                    }
                }
            }

            this._profile = { name, role, org, email, phone, birthday, photo };
            this.render(this._profile);
        } catch (e) {
            console.error('Failed to load Solid profile', e);
            this.shadowRoot.innerHTML = `<p>Could not load profile</p>`;
        }
    }

    render({ name, role, org, email, phone, birthday, photo }) {
        const safeName = escapeHtml(name);
        const safeRole = escapeHtml(role);
        const safeOrg = escapeHtml(org);
        const safeEmail = escapeHtml(email);
        const safePhone = escapeHtml(phone);
        const safeBirthday = escapeHtml(birthday);
        const safePhoto = escapeHtml(photo);

        this.shadowRoot.innerHTML = `
       <style>
        :host {
          display: inline-block;
          font-family: 'Montserrat', 'Raleway', ui-sans-serif, system-ui, -apple-system, sans-serif;
        }
        .card {
          position: relative;
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 1.5rem;
          align-items: center;
          padding: 28px 32px;
          border-radius: 16px;
          background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
          border: 2px solid #d4af37;
          box-shadow: 0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.2);
          max-width: 560px;
          color: #ffffff;
          overflow: hidden;
        }
        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            linear-gradient(45deg, transparent 48%, rgba(212,175,55,0.1) 49%, rgba(212,175,55,0.1) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(212,175,55,0.1) 49%, rgba(212,175,55,0.1) 51%, transparent 52%);
          background-size: 60px 60px;
          background-position: 0 0, 30px 30px;
          opacity: 0.15;
          pointer-events: none;
        }
        .card::after {
          content: '';
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          bottom: 12px;
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 12px;
          pointer-events: none;
        }
        .avatar {
          position: relative;
          width: 110px;
          height: 110px;
          border-radius: 50%;
          object-fit: cover;
          background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
          border: 3px solid #d4af37;
          box-shadow: 0 4px 16px rgba(212,175,55,0.3);
          z-index: 1;
        }
        .content {
          position: relative;
          display: grid;
          grid-template-rows: auto auto auto;
          row-gap: 8px;
          z-index: 1;
        }
        .name {
          font-weight: 700;
          font-size: 1.5rem;
          line-height: 1.2;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #ffffff;
          text-shadow: 0 2px 8px rgba(0,0,0,0.5);
        }
        .meta {
          color: #d4af37;
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        .org {
          color: #c9c9c9;
          font-size: 0.9rem;
          letter-spacing: 0.3px;
        }
        .contact {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 10px;
          font-size: 0.9rem;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .contact-item::before {
          content: '◆';
          color: #d4af37;
          font-size: 0.6rem;
        }
        .contact a {
          color: #e8e8e8;
          text-decoration: none;
          transition: color 0.2s;
        }
        .contact a:hover {
          color: #d4af37;
        }
        .label {
          color: #999;
          margin-right: 4px;
        }
        .divider {
          height: 2px;
          background: linear-gradient(to right, #d4af37, transparent);
          margin: 10px 0;
        }
        .footer {
          color: #d4af37;
          font-size: 0.85rem;
        }
        @media (max-width: 420px) {
          .card {
            grid-template-columns: 85px 1fr;
            padding: 20px 24px;
          }
          .avatar { width: 85px; height: 85px; }
          .name { font-size: 1.25rem; }
        }
      </style>

      <div class="card" role="group" aria-label="Business card">
        ${safePhoto ? `<img class="avatar" src="${safePhoto}" alt="Photo of ${safeName}">` : '<div class="avatar" aria-hidden="true"></div>'}
        <div class="content">
          <div class="name">${safeName}</div>
          ${safeRole ? `<div class="meta">${safeRole}</div>` : ''}
          ${safeOrg ? `<div class="org">${safeOrg}</div>` : ''}
          <div class="divider"></div>
          <div class="contact">
            ${safeEmail ? `<div class="contact-item"><span class="label">Email:</span> <a href="mailto:${safeEmail}">${safeEmail}</a></div>` : ''}
            ${safePhone ? `<div class="contact-item"><span class="label">Phone:</span> <a href="tel:${safePhone}">${safePhone}</a></div>` : ''}
            ${safeBirthday ? `<div class="contact-item"><span class="label">Birthday:</span> ${safeBirthday}</div>` : ''}
          </div>
        </div>
      </div>
    `;
    }
}

if (!customElements.get('solid-vcard-card')) {
    customElements.define('solid-vcard-card', SolidVCardCard);
}
