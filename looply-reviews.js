/* ============================================================================
   LOOPLY ATSILIEPIMŲ SISTEMA (Firebase Realtime Database)
   ============================================================================
   ⚠️ PRIVALOMAS ŽINGSNIS PRIEŠ NAUDOJIMĄ:
   Žemiau, sekcijoje "1) FIREBASE KONFIGŪRACIJA", įklijuokite savo Firebase
   projekto raktus. Kol to nepadarysite, atsiliepimų forma neveiks.
   Detali instrukcija, kaip gauti šiuos raktus, atsiųsta atskirai pokalbyje
   (arba žr. FIREBASE_INSTRUKCIJA.md failą).
   ========================================================================= */

(function () {
    "use strict";

    // ------------------------------------------------------------------
    // 1) FIREBASE KONFIGŪRACIJA - ĮKLIJUOKITE SAVO REIKŠMES ČIA
    // ------------------------------------------------------------------
    const firebaseConfig = {
        apiKey: "AIzaSyCYmKXT_54zsU3st5B-40bd017fEQBhxDo",
        authDomain: "looply-atsiliepimai.firebaseapp.com",
        databaseURL: "https://looply-atsiliepimai-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "looply-atsiliepimai",
        storageBucket: "looply-atsiliepimai.firebasestorage.app",
        messagingSenderId: "320177524819",
        appId: "1:320177524819:web:47f8925cf3e0f22ab0f6a6",
        measurementId: "G-WG2R2FZVGM"
    };

    // ------------------------------------------------------------------
    // 2) ADMINISTRATORIAUS SLAPTAS RAKTAS
    //    Pakeiskite "secret123" į savo unikalų, sunkiai atspėjamą kodą.
    //    Į svetainę su admin teisėmis įeisite per:
    //    https://jusu-svetaine.lt/?admin=JUSU_SLAPTAS_KODAS
    // ------------------------------------------------------------------
    const ADMIN_SECRET = "GustisMarius2026!";

    // ------------------------------------------------------------------
    // Patikriname, ar Firebase konfigūracija jau įklijuota
    // ------------------------------------------------------------------
    const configReady = firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("ČIA_ĮKLIJUOKITE");

    if (!configReady) {
        console.warn(
            "[Looply Atsiliepimai] Firebase konfigūracija dar neįklijuota faile looply-reviews.js. " +
            "Atsiliepimų forma ir sąrašas neveiks, kol neįrašysite savo Firebase projekto raktų."
        );
        const loadingEl = document.getElementById('reviews-loading');
        if (loadingEl) {
            loadingEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation mr-2 text-yellow-500"></i> Atsiliepimų sistema dar nesukonfigūruota (trūksta Firebase raktų).';
        }
        return; // sustabdome vykdymą, kol nėra tinkamos konfigūracijos
    }

    // ------------------------------------------------------------------
    // 3) FIREBASE INICIALIZAVIMAS
    // ------------------------------------------------------------------
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();
    const reviewsRef = db.ref('atsiliepimai');

    // ------------------------------------------------------------------
    // 4) ADMIN REŽIMO NUSTATYMAS (per URL parametrą ?admin=...)
    // ------------------------------------------------------------------
    const urlParams = new URLSearchParams(window.location.search);
    const isAdmin = urlParams.get('admin') === ADMIN_SECRET;

    if (isAdmin) {
        const badge = document.getElementById('admin-badge');
        if (badge) badge.classList.remove('hidden');
    }

    // ------------------------------------------------------------------
    // 5) ŽVAIGŽDUČIŲ ĮVERTINIMO WIDGETAS
    // ------------------------------------------------------------------
    let selectedRating = 0;

    function setupStarRating() {
        const container = document.getElementById('star-rating');
        if (!container) return;
        container.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.className = 'fa-regular fa-star text-2xl text-gray-600 cursor-pointer hover:text-neonPink hover:scale-110 transition-all';
            star.dataset.value = String(i);
            star.setAttribute('role', 'button');
            star.setAttribute('aria-label', i + ' žvaigždutės');
            star.addEventListener('click', () => {
                selectedRating = i;
                updateStarDisplay();
            });
            container.appendChild(star);
        }
    }

    function updateStarDisplay() {
        const stars = document.querySelectorAll('#star-rating i');
        stars.forEach((star) => {
            const val = parseInt(star.dataset.value, 10);
            if (val <= selectedRating) {
                star.className = 'fa-solid fa-star text-2xl text-neonPink cursor-pointer hover:scale-110 transition-all';
            } else {
                star.className = 'fa-regular fa-star text-2xl text-gray-600 cursor-pointer hover:text-neonPink hover:scale-110 transition-all';
            }
        });
    }

    // ------------------------------------------------------------------
    // 6) TEKSTO SAUGUS ATVAIZDAVIMAS (apsauga nuo HTML/skriptų injekcijos)
    // ------------------------------------------------------------------
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ------------------------------------------------------------------
    // 7) FORMOS PATEIKIMAS + APSAUGA NUO TUŠČIŲ LAUKŲ
    // ------------------------------------------------------------------
    const form = document.getElementById('review-form');
    const errorEl = document.getElementById('review-error');
    const successEl = document.getElementById('review-success');
    const submitBtn = document.getElementById('review-submit-btn');

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

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const nameInput = document.getElementById('review-name');
            const textInput = document.getElementById('review-text');
            const name = nameInput.value.trim();
            const text = textInput.value.trim();

            if (!name) {
                showError('Prašome įrašyti savo vardą.');
                nameInput.focus();
                return;
            }
            if (selectedRating === 0) {
                showError('Prašome pasirinkti įvertinimą žvaigždutėmis.');
                return;
            }
            if (!text) {
                showError('Prašome parašyti atsiliepimo tekstą.');
                textInput.focus();
                return;
            }
            if (text.length < 5) {
                showError('Atsiliepimo tekstas per trumpas - parašykite bent kelis žodžius.');
                textInput.focus();
                return;
            }

            errorEl.classList.add('hidden');
            submitBtn.disabled = true;
            submitBtn.innerText = 'Siunčiama...';

            const newReviewRef = reviewsRef.push();
            newReviewRef.set({
                name: name,
                text: text,
                rating: selectedRating,
                timestamp: Date.now()
            }).then(() => {
                nameInput.value = '';
                textInput.value = '';
                selectedRating = 0;
                updateStarDisplay();
                showSuccess('Ačiū! Jūsų atsiliepimas sėkmingai išsiųstas.');
            }).catch((err) => {
                console.error('[Looply Atsiliepimai] Klaida siunčiant atsiliepimą:', err);
                showError('Nepavyko išsiųsti atsiliepimo. Patikrinkite interneto ryšį ir bandykite dar kartą.');
            }).finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Siųsti atsiliepimą';
            });
        });
    }

    // ------------------------------------------------------------------
    // 8) REALIU LAIKU ATNAUJINAMAS ATSILIEPIMŲ SĄRAŠAS + SKAITIKLIS
    // ------------------------------------------------------------------
    const listContainer = document.getElementById('reviews-list');
    const emptyMsg = document.getElementById('reviews-empty');
    const loadingMsg = document.getElementById('reviews-loading');
    const countEl = document.getElementById('review-count');

    reviewsRef.on('value', (snapshot) => {
        if (loadingMsg) loadingMsg.classList.add('hidden');

        const data = snapshot.val() || {};
        const entries = Object.entries(data).sort(
            (a, b) => (b[1].timestamp || 0) - (a[1].timestamp || 0)
        );

        if (countEl) countEl.textContent = String(entries.length);
        if (!listContainer) return;
        listContainer.innerHTML = '';

        if (entries.length === 0) {
            if (emptyMsg) emptyMsg.classList.remove('hidden');
            return;
        }
        if (emptyMsg) emptyMsg.classList.add('hidden');

        entries.forEach(([id, review]) => {
            const card = document.createElement('div');
            card.className = 'bg-darkCard border border-gray-800 rounded-2xl p-5 flex flex-col';

            const rating = Math.max(0, Math.min(5, parseInt(review.rating, 10) || 0));
            const starsHtml = Array.from({ length: 5 }, (_, i) =>
                `<i class="fa-solid fa-star text-sm ${i < rating ? 'text-neonPink' : 'text-gray-700'}"></i>`
            ).join('');

            const safeName = escapeHtml(review.name || 'Anonimas');
            const safeText = escapeHtml(review.text || '');

            card.innerHTML = `
                <div class="flex items-center justify-between mb-2 gap-3">
                    <span class="font-bold text-white text-sm truncate">${safeName}</span>
                    <div class="flex gap-0.5 shrink-0">${starsHtml}</div>
                </div>
                <p class="text-gray-400 text-sm leading-relaxed whitespace-pre-line">${safeText}</p>
            `;

            if (isAdmin) {
                const adminBar = document.createElement('div');
                adminBar.className = 'flex gap-3 mt-4 pt-3 border-t border-gray-800';
                adminBar.innerHTML = `
                    <button type="button" class="edit-btn text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"><i class="fa-solid fa-pen mr-1"></i>Redaguoti</button>
                    <button type="button" class="delete-btn text-xs text-red-400 hover:text-red-300 font-semibold transition-colors"><i class="fa-solid fa-trash mr-1"></i>Ištrinti</button>
                `;
                adminBar.querySelector('.delete-btn').addEventListener('click', () => {
                    if (window.confirm('Ar tikrai norite negrįžtamai ištrinti šį atsiliepimą?')) {
                        reviewsRef.child(id).remove().catch((err) => {
                            console.error('[Looply Atsiliepimai] Klaida trinant:', err);
                            alert('Nepavyko ištrinti atsiliepimo. Bandykite dar kartą.');
                        });
                    }
                });
                adminBar.querySelector('.edit-btn').addEventListener('click', () => {
                    const newText = window.prompt('Redaguoti atsiliepimo tekstą:', review.text || '');
                    if (newText !== null && newText.trim() !== '') {
                        reviewsRef.child(id).update({ text: newText.trim() }).catch((err) => {
                            console.error('[Looply Atsiliepimai] Klaida redaguojant:', err);
                            alert('Nepavyko atnaujinti atsiliepimo. Bandykite dar kartą.');
                        });
                    }
                });
                card.appendChild(adminBar);
            }

            listContainer.appendChild(card);
        });
    }, (err) => {
        console.error('[Looply Atsiliepimai] Klaida skaitant duomenų bazę:', err);
        if (loadingMsg) {
            loadingMsg.classList.remove('hidden');
            loadingMsg.innerHTML = '<i class="fa-solid fa-triangle-exclamation mr-2 text-red-500"></i> Nepavyko įkelti atsiliepimų. Patikrinkite interneto ryšį.';
        }
    });

    // ------------------------------------------------------------------
    // Paleidimas
    // ------------------------------------------------------------------
    setupStarRating();

})();
