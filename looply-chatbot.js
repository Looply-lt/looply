/* ============================================================================
   LOOPLY AI ASISTENTAS – ŽINIŲ BAZĖ IR ATSAKYMŲ VARIKLIS
   ============================================================================
   Šis failas yra BENDRAS visiems svetainės puslapiams (index.html,
   apiemus.html, auditas.html, politika.html, salygos.html). Jį pakeitus,
   pokyčiai automatiškai pritaikomi VISUR – nereikia redaguoti kiekvieno
   HTML failo atskirai.

   KAIP PRIDĖTI NAUJĄ ATSAKYMĄ ATEITYJE:
   1. Nukopijuokite bet kurį žemiau esantį objektą masyve KNOWLEDGE_BASE.
   2. `keywords` – žodžiai ar frazės, kuriuos žmonės gali parašyti (be
      diakritikų RAŠYTI NEBŪTINA – sistema pati pašalina ą,č,ę,ė,į,š,ų,ū,ž
      prieš lygindama, todėl užtenka rašyti su lietuviškomis raidėmis).
      Kuo daugiau variantų (sinonimų, šnekamosios kalbos formų) – tuo
      geriau botas atpažins klausimą.
   3. `answer` – tekstas, kurį vartotojas pamatys. Galima naudoti kelis
      sakinius, bet geriau trumpai ir aiškiai (2–4 sakiniai).
   4. Jei reikia atnaujinti kainą, terminą ar kitą faktą – tiesiog
      pakeiskite `answer` tekstą jau esančiame įraše, NAUJO įrašo kurti
      nereikia.
   5. Niekada čia nerašykite konkrečių trečiųjų šalių įrankių pavadinimų
      (pvz. konkrečių automatizacijos platformų pavadinimų) – bendrovės
      politika yra jų viešai neatskleisti. Naudokite bendrus terminus:
      „automatizacijos technologijos“, „automatizacijos platformos“ ir t.t.
   ========================================================================= */

(function (global) {
    "use strict";

    // ------------------------------------------------------------------
    // 1) TEKSTO NORMALIZAVIMAS (kad "Kokia kaina?" == "kokia kaina" == "KAINA")
    // ------------------------------------------------------------------
    function normalize(text) {
        if (!text) return "";
        const map = {
            'ą': 'a', 'č': 'c', 'ę': 'e', 'ė': 'e', 'į': 'i',
            'š': 's', 'ų': 'u', 'ū': 'u', 'ž': 'z',
            'Ą': 'a', 'Č': 'c', 'Ę': 'e', 'Ė': 'e', 'Į': 'i',
            'Š': 's', 'Ų': 'u', 'Ū': 'u', 'Ž': 'z'
        };
        return text
            .toLowerCase()
            .replace(/[ąčęėįšųūžĄČĘĖĮŠŲŪŽ]/g, (ch) => map[ch] || ch)
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // ------------------------------------------------------------------
    // 2) ŽINIŲ BAZĖ – sudaryta iš index.html, apiemus.html,
    //    auditas.html, politika.html ir salygos.html turinio.
    // ------------------------------------------------------------------
    const KNOWLEDGE_BASE = [
        // --- Pasisveikinimai / mandagumas -------------------------------
        {
            id: "sveikinimas",
            keywords: ["labas", "sveiki", "sveikas", "laba diena", "laba rytas", "labas vakaras", "hey", "hi", "hello"],
            answer: "Sveiki! 👋 Esu Looply AI asistentas. Galiu papasakoti apie mūsų paslaugas, kainas, nemokamą auditą arba padėti susisiekti su komanda. Ko norėtumėte sužinoti?"
        },
        {
            id: "aciu",
            keywords: ["aciu", "dekui", "dekoju", "super ačiū", "thanks"],
            answer: "Prašom! 🙂 Jei kils daugiau klausimų – visada čia būsiu. O jei norite konkretaus plano jūsų verslui, galite užsiregistruoti nemokamam auditui puslapyje „Nemokamas auditas“."
        },
        {
            id: "atsisveikinimas",
            keywords: ["viso gero", "iki", "sudie", "labanakt"],
            answer: "Viso gero! Jei prireiks – visada mane rasite čia, apačioje dešinėje. 👋"
        },

        // --- Bendra info apie įmonę --------------------------------------
        {
            id: "kas-esate",
            keywords: ["kas jus esate", "kas esate", "apie jus", "apie imone", "apie kompanija", "kas yra looply", "komanda", "kas per imone"],
            answer: "Looply – tai verslo procesų automatizacijos ir dirbtinio intelekto integracijos komanda. Padedame įmonėms atsikratyti pasikartojančių, rankinių užduočių (duomenų kopijavimo, sąskaitų pildymo, el. laiškų tikrinimo) sujungdami jūsų naudojamus įrankius į vieną, savarankiškai veikiančią sistemą. Daugiau apie mus rasite skiltyje „Apie mus“."
        },
        {
            id: "vizija",
            keywords: ["vizija", "misija", "kodel jus", "kodel rinktis", "kuo skiriates", "privalumai"],
            answer: "Nekuriame šablonų – kiekvieną automatizaciją pritaikome jūsų unikaliems poreikiams, integruojame dirbtinį intelektą tiesiai į procesus (ne tik kalbame apie jį) ir nepaliekame jūsų vienų po paleidimo – nuolat stebime ir prižiūrime sukurtus scenarijus."
        },

        // --- Paslaugos --------------------------------------------------
        {
            id: "paslaugos-bendra",
            keywords: ["ka darote", "kokias paslaugas teikiate", "paslaugos", "ka jus siulote", "kuo galite padeti", "veikla"],
            answer: "Mes automatizuojame šešias pagrindines sritis: Gmail/el. pašto automatizaciją, išmanius AI chat botus svetainei, lead'ų (užklausų) apdorojimą, soc. medijų (Facebook, Instagram, YouTube) turinio automatizaciją, sąskaitų ir mokėjimų automatizaciją bei reputacijos (atsiliepimų) valdymą. Norite plačiau apie kurią nors iš šių sričių?"
        },
        {
            id: "gmail",
            keywords: ["gmail", "el pastas automatizacija", "laiskai", "pastas"],
            answer: "Automatizuojame el. pašto srautą: filtruojame įeinančias užklausas, generuojame protingus atsakymus ir automatiškai priskiriame užduotis komandai pagal laiško turinį – be jokio rankinio darbo."
        },
        {
            id: "chatbotai",
            keywords: ["chat botai", "chatbotas", "dirbtinis intelektas svetaineje", "ai asistentas svetainei", "botas svetainei"],
            answer: "Taip, kuriame išmanius AI chat botus jūsų svetainei – jie aptarnauja lankytojus realiu laiku, supranta kontekstą, atsako į D.U.K. ir registruoja naujus klientus tiesiai į jūsų CRM sistemą. Beje, būtent tokį asistentą jūs dabar ir kalbinate! 😉"
        },
        {
            id: "lead-apdorojimas",
            keywords: ["lead", "leadu apdorojimas", "uzklausu apdorojimas", "nauji klientai"],
            answer: "Kai klientas užpildo formą, sistema akimirksniu išsiunčia SMS ar laišką, sukuria kortelę CRM sistemoje, priskiria atsakingą vadybininką ir informuoja jūsų komandą – viskas automatiškai, per kelias sekundes."
        },
        {
            id: "soc-medijos",
            keywords: ["soc medij", "socialiniu medij", "facebook", "instagram", "youtube", "postai", "turinio kelimas", "kontento automatizacija"],
            answer: "Automatiškai generuojame ir publikuojame AI/DI sukurtą turinį jūsų „Facebook“, „Instagram“, „YouTube“ ir kituose soc. medijų profiliuose pagal iš anksto suplanuotą grafiką – be jokio rankinio kėlimo."
        },
        {
            id: "saskaitos",
            keywords: ["saskaitos", "mokejimai", "saskaitu faktūros", "priminimai apie mokejima"],
            answer: "Automatizuojame sąskaitų faktūrų generavimą iškart po sandorio uždarymo, o pavėlavus apmokėti – sistema pati mandagiai primena klientui, kad nereikėtų to daryti rankiniu būdu."
        },
        {
            id: "reputacija",
            keywords: ["reputacija", "atsiliepimai", "recenzijos", "google atsiliepimai"],
            answer: "Automatiškai renkame atsiliepimus po pirkimo: patenkintus klientus nukreipiame tiesiai į Google ar Facebook, o nepatenkintų atsiliepimus – iš karto persiunčiame jūsų komandai, kad galėtumėte reaguoti pirmi."
        },

        // --- Kainos -------------------------------------------------------
        {
            id: "kainos",
            keywords: ["kaina", "kiek kainuoja", "kainos", "kainodara", "paketai", "kiek kainuotu", "biudzetas"],
            answer: "Turime tris pasiūlymus: „Starteris“ nuo €490 (vienas scenarijus + €69–99/mėn. priežiūra), „Procesų paketas“ nuo €690 (2–3 susiję scenarijai + €159–199/mėn., populiariausias pasirinkimas) ir „Pilna ekosistema“ nuo €1190+ (visa procesų grandinė + €249+/mėn.). Tiksli kaina priklauso nuo jūsų poreikių – tai išsiaiškiname per nemokamą auditą."
        },
        {
            id: "prieziura",
            keywords: ["prieziura", "menesinis mokestis", "ka apima prieziura", "palaikymas"],
            answer: "Mėnesinis priežiūros mokestis apima visų sukurtų scenarijų stebėjimą, klaidų taisymą pasikeitus trečiųjų šalių sistemoms bei smulkius pakeitimus. Visiškai naujų scenarijų ar integracijų kūrimas apmokestinamas atskirai."
        },

        // --- Nemokamas auditas --------------------------------------------
        {
            id: "auditas",
            keywords: ["auditas", "nemokamas auditas", "kaip uzsiregistruoti", "registracija", "konsultacija", "susitikimas"],
            answer: "Nemokamas procesų auditas trunka apie 30 minučių – peržvelgiame jūsų kasdienę veiklą, atrandame daugiausiai laiko atimančias užduotis ir pateikiame konkretų automatizacijos planą. Užsiregistruoti galite skiltyje „Nemokamas auditas“, tiesiog užpildę trumpą formą."
        },
        {
            id: "trukme-igyvendinimo",
            keywords: ["kiek laiko trunka", "igyvendinimo trukme", "per kiek laiko", "kada bus paruosta"],
            answer: "Paprastesni scenarijai (pvz. duomenų perkėlimas tarp dviejų programų) įgyvendinami per 1–2 savaites. Pilnos, visą įmonę apimančios ekosistemos kūrimas ir testavimas gali užtrukti nuo 3 iki 6 savaičių."
        },

        // --- Techniniai / suderinamumo klausimai ---------------------------
        {
            id: "keisti-programas",
            keywords: ["reikes keisti programas", "keisti sistemas", "nauja sistema", "esamos programos"],
            answer: "Dažniausiai ne – mūsų tikslas yra sujungti jūsų jau turimus įrankius (pvz. Gmail, jūsų CRM, Excel/Sheets, buhalterinę programą) į vieną bendrą grandinę, kad komandai nereikėtų keisti įpročių ar mokytis naujų sistemų."
        },
        {
            id: "specifine-sistema",
            keywords: ["specifine sistema", "kita apskaitos sistema", "netipine sistema", "api integracija", "webhook"],
            answer: "Nesame prisirišę prie vieno įrankio. Jei jūsų naudojama sistema turi API sąsają arba palaiko Webhook užklausas, galime ją integruoti ir sujungti su bet kuria kita jūsų ekosistemos dalimi naudodami savo automatizacijos technologijas."
        },
        {
            id: "ar-naudoja-ai",
            keywords: ["ar naudojate dirbtini intelekta", "ar chatbotas ai", "llm", "kalbos modelis"],
            answer: "Taip! Mūsų kuriami chat botai integruoja pažangius kalbos modelius (LLM), suprogramuotus pagal jūsų svetainės turinį ir verslo taisykles – jie bendrauja natūraliai ir patikimai renka klientų kontaktus."
        },

        // --- Kontaktai --------------------------------------------------
        {
            id: "kontaktai",
            keywords: ["kontaktai", "susisiekti", "telefonas", "el pastas", "numeris", "adresas", "kur esate"],
            answer: "Su mumis galite susisiekti el. paštu looplylt@gmail.com, telefonu 060220515 arba 064753394, arba užpildę nemokamo audito formą – komanda atsakys per 24 valandas. Mūsų būstinė – Vilniuje, Lietuvoje."
        },

        // --- Privatumo politika ------------------------------------------
        {
            id: "privatumas",
            keywords: ["privatumo politika", "asmens duomenys", "gdpr", "duomenu apsauga", "kokius duomenis renkate"],
            answer: "Renkame tik būtiną informaciją (vardą, el. paštą, įmonės pavadinimą), kurią pateikiate savo noru, pvz. pildydami audito formą – ji naudojama tik audito paruošimui ir bendravimui su jumis. Jūsų duomenys niekada neparduodami trečiosioms šalims. Visas sąlygas rasite skiltyje „Privatumo politika“."
        },
        {
            id: "nda-konfidencialumas",
            keywords: ["konfidencialumas", "nda", "verslo paslaptys", "slapti duomenys"],
            answer: "Gerbiame jūsų verslo paslaptis – audito metu nereikalaujame jokių jautrių prisijungimų, o esant poreikiui prieš analizę pasirašome konfidencialumo sutartį (NDA)."
        },
        {
            id: "slapukai",
            keywords: ["slapukai", "cookies", "cookie"],
            answer: "Svetainėje naudojami slapukai, skirti pagerinti naršymo patirtį, analizuoti srautą bei užtikrinti sklandų šio AI asistento veikimą. Juos bet kada galite išjungti naršyklės nustatymuose."
        },
        {
            id: "duomenu-teises",
            keywords: ["istrinti duomenis", "teise susipazinti", "atnaujinti duomenis", "duomenu istrynimas"],
            answer: "Turite teisę bet kada susipažinti su savo asmens duomenimis, juos ištaisyti, atnaujinti arba visiškai ištrinti – tiesiog parašykite mums el. paštu looplylt@gmail.com."
        },

        // --- Paslaugų teikimo sąlygos ---------------------------------------
        {
            id: "apmokejimo-tvarka",
            keywords: ["apmokejimo tvarka", "kaip mokate", "avansas", "saskaitos apmokejimas", "veluoju moketi"],
            answer: "Kaina, apmokėjimo grafikas (dažniausiai avansas prieš darbų pradžią ir likutis po įgyvendinimo) bei mokėjimo būdai nurodomi individualiame pasiūlyme. Vėluojant atsiskaityti daugiau nei 14 dienų, galime laikinai sustabdyti darbus ar priežiūrą, kol įsiskolinimas padengiamas."
        },
        {
            id: "sutarties-nutraukimas",
            keywords: ["sutarties nutraukimas", "nutraukti sutarti", "atsisakyti paslaugu", "atsisakymas"],
            answer: "Bet kuri šalis gali nutraukti bendradarbiavimą raštišku pranešimu prieš 30 kalendorinių dienų, jei sutartyje nesusitarta kitaip. Nutraukus sutartį, apmokama tik už iki tos dienos faktiškai atliktus darbus."
        },
        {
            id: "intelektine-nuosavybe",
            keywords: ["intelektine nuosavybe", "kam priklauso kodas", "nuosavybes teises", "scenariju nuosavybe"],
            answer: "Visi jums sukurti automatizacijos scenarijai po pilno apmokėjimo pereina jūsų nuosavybėn ir naudojimui. Mūsų bendrieji kodo moduliai ir metodologijos lieka mūsų intelektine nuosavybe."
        },
        {
            id: "atsakomybe",
            keywords: ["atsakomybe", "garantija", "kas jei neveikia", "atsakomybes ribojimas"],
            answer: "Atsakome už savo sukurtus sprendimus, tačiau neatsakome už netiesioginius nuostolius ar trečiųjų šalių platformų (pvz. jūsų naudojamo el. pašto ar CRM tiekėjo) veiklos sutrikimus. Pilną informaciją rasite skiltyje „Paslaugų teikimo sąlygos“."
        },
        {
            id: "treciosios-salys",
            keywords: ["treciuju saliu platformos", "kas jei pasikeicia api", "platformu atnaujinimai"],
            answer: "Integruojame trečiųjų šalių sistemas (el. paštą, DI platformas, CRM ir kt.). Nors neatsakome už jų pačių sutrikimus, pagal priežiūros sutartį stengiamės kuo greičiau prisitaikyti prie bet kokių jų pakeitimų."
        },
        {
            id: "taikoma-teise",
            keywords: ["taikoma teise", "gincu sprendimas", "kokia teise galioja", "teismas"],
            answer: "Mūsų paslaugų teikimo sąlygoms taikoma Lietuvos Respublikos teisė. Iškilus ginčams, pirmiausia sieksime juos išspręsti derybomis, o nepavykus – ginčai sprendžiami Lietuvos Respublikos teismuose."
        }
    ];

    // Kiekvienam KB įrašui iš anksto paruošiame normalizuotus raktažodžius (greitesnis paieškos veikimas)
    KNOWLEDGE_BASE.forEach(entry => {
        entry._normKeywords = entry.keywords.map(normalize);
    });

    // ------------------------------------------------------------------
    // 3) ATSAKYMŲ PARINKIMO LOGIKA
    // ------------------------------------------------------------------
    const FALLBACK_ANSWERS = [
        "Šiuo klausimu tiksliai atsakyti automatiškai negaliu, bet mūsų komanda mielai padės! Užpildykite nemokamo audito formą arba parašykite el. paštu looplylt@gmail.com – atsakysime per 24 val.",
        "Geras klausimas, tačiau man reikėtų daugiau konteksto, kad atsakyčiau tiksliai. Galite paklausti apie mūsų paslaugas, kainas, nemokamą auditą, terminus ar sąlygas – arba tiesiog parašykite mums el. paštu looplylt@gmail.com."
    ];

    function pickFallback() {
        return FALLBACK_ANSWERS[Math.floor(Math.random() * FALLBACK_ANSWERS.length)];
    }

    /**
     * Grąžina geriausią atsakymą pagal vartotojo įvestą žinutę.
     * @param {string} userMessage - neapdorotas vartotojo tekstas
     * @returns {string} atsakymo tekstas
     */
    function getAnswer(userMessage) {
        const norm = normalize(userMessage);
        if (!norm) return pickFallback();

        let bestScore = 0;
        let bestEntry = null;

        for (const entry of KNOWLEDGE_BASE) {
            let score = 0;
            for (const kw of entry._normKeywords) {
                if (!kw) continue;
                if (norm === kw) {
                    score += kw.length * 3; // tikslus sutapimas vertinamas labiausiai
                } else if (norm.includes(kw)) {
                    score += kw.length * 2; // frazė yra žinutėje
                } else {
                    // patikriname ar visi frazės žodžiai atskirai yra žinutėje (laisvesnis atpažinimas)
                    const kwWords = kw.split(' ');
                    if (kwWords.length > 1 && kwWords.every(w => norm.includes(w))) {
                        score += kw.length;
                    }
                }
            }
            if (score > bestScore) {
                bestScore = score;
                bestEntry = entry;
            }
        }

        if (bestEntry && bestScore >= 3) {
            return bestEntry.answer;
        }
        return pickFallback();
    }

    // Viešai prieinama sąsaja
    global.LooplyBot = {
        getAnswer: getAnswer,
        normalize: normalize,
        KNOWLEDGE_BASE: KNOWLEDGE_BASE // paliekama vieša, jei prireiktų derinti/testuoti
    };

})(window);
