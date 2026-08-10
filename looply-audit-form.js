/* ============================================================================
   LOOPLY AUDITO FORMA - EmailJS siuntimas + apsauga nuo spamo
   ============================================================================ */

(function () {
    "use strict";

    // ------------------------------------------------------------------
    // 1) EMAILJS RAKTAI
    // ------------------------------------------------------------------
    const EMAILJS_SERVICE_ID = "service_cccf9en";
    const EMAILJS_TEMPLATE_ID = "template_wa8ccen";
    const EMAILJS_PUBLIC_KEY = "Zu86YEzunRfVUHG5l";

    // ------------------------------------------------------------------
    // 2) APSAUGOS NUO SPAMO NUSTATYMAI
    // ------------------------------------------------------------------
    const RATE_LIMIT_MAX = 3;                    // kiek siuntimų leidžiama
    const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // per 24 val.
    const RATE_LIMIT_STORAGE_KEY = "looply_audit_submissions";

    function getRecentSubmissions() {
        try {
            const raw = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
            const arr = raw ? JSON.parse(raw) : [];
            const cutoff = Date.now() - RATE_LIMIT_WINDOW_MS;
            return Array.isArray(arr) ? arr.filter((ts) => ts > cutoff) : [];
        } catch (e) {
            return [];
        }
    }

    function recordSubmission() {
        const recent = getRecentSubmissions();
        recent.push(Date.now());
        try {
            localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(recent));
        } catch (e) { /* localStorage nepasiekiama - tyliai ignoruojame */ }
    }

    // ------------------------------------------------------------------
    // 3) EMAILJS INICIALIZAVIMAS
    // ------------------------------------------------------------------
    if (window.emailjs) {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }

    // ------------------------------------------------------------------
    // 4) FORMOS ELEMENTAI
    // ------------------------------------------------------------------
    const form = document.getElementById('audit-form');
    if (!form) return;

    const submitBtn = document.getElementById('audit-submit-btn');
    const errorEl = document.getElementById('audit-error');
    const successEl = document.getElementById('audit-success');

    function showError(msg) {
        errorEl.textContent = msg;
        errorEl.classList.remove('hidden');
        successEl.classList.add('hidden');
    }

    function showSuccess(msg) {
        successEl.textContent = msg;
        successEl.classList.remove('hidden');
        errorEl.classList.add('hidden');
    }

    // ------------------------------------------------------------------
    // 5) FORMOS PATEIKIMAS
    // ------------------------------------------------------------------
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Honeypot - jei botas užpildė paslėptą lauką, tyliai ignoruojame
        const honeypot = form.querySelector('[name="botcheck"]');
        if (honeypot && honeypot.checked) {
            return;
        }

        // --- Apsauga nuo spamo (localStorage limitas) ---
        const recent = getRecentSubmissions();
        if (recent.length >= RATE_LIMIT_MAX) {
            showError('Pasiektas dienos limitas (3 auditai). Bandykite vėl po 24 valandų.');
            return;
        }

        // --- Laukelių surinkimas ---
        const name = document.getElementById('audit-name').value.trim();
        const company = document.getElementById('audit-company').value.trim();
        const email = document.getElementById('audit-email').value.trim();
        const phone = document.getElementById('audit-phone').value.trim();
        const tools = document.getElementById('audit-tools').value.trim();
        const message = document.getElementById('audit-message').value.trim();

        // --- Privalomų laukų validacija ---
        if (!name || !email || !phone || !company || !tools) {
            showError('Prašome užpildyti visus privalomus laukus.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerText = 'Siunčiama...';

        const templateParams = {
            name: name,
            company: company,
            email: email,
            phone: phone,
            tools: tools,
            message: message || '—'
        };

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(() => {
                recordSubmission();
                form.reset();
                showSuccess('Ačiū! Jūsų audito užklausa gauta.');
            })
            .catch((err) => {
                console.error('[Looply Auditas] EmailJS klaida:', err);
                showError('Nepavyko išsiųsti užklausos. Bandykite dar kartą arba rašykite mums tiesiogiai.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Siųsti užklausą auditui';
            });
    });

})();
