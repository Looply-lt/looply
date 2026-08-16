# Kaip prijungti nemokamą Firebase duomenų bazę atsiliepimų sistemai

Ši instrukcija padės per ~10 minučių gauti nemokamus Firebase raktus ir juos
įklijuoti į svetainės kodą, kad atsiliepimai realiu laiku išsisaugotų
serveryje ir matytųsi visiems lankytojams.

---

## 1 žingsnis – Susikurkite Firebase projektą

1. Eikite į **https://console.firebase.google.com/**
2. Prisijunkite su savo Google (Gmail) paskyra.
3. Spauskite **„Add project" / „Sukurti projektą"**.
4. Įveskite pavadinimą, pvz. `looply-atsiliepimai` → **Continue**.
5. Google Analytics siūlymą galite **išjungti** (nebūtina) → **Create project**.
6. Palaukite ~30 sek., kol projektas sukuriamas → **Continue**.

## 2 žingsnis – Įjunkite Realtime Database

1. Kairėje meniu juostoje raskite **Build → Realtime Database**.
2. Spauskite **„Create Database"**.
3. Pasirinkite serverio vietą (pvz. `europe-west1` – arčiausiai Lietuvos).
4. Pasirinkite **„Start in test mode"** (vėliau taisykles pakeisime patys, žr. 4 žingsnį) → **Enable**.

## 3 žingsnis – Užregistruokite svetainę ir gaukite raktus (API keys)

1. Kairėje viršuje spauskite **⚙️ (krumpliaratį) → Project settings**.
2. Nusileiskite iki **„Your apps"** ir spauskite piktogramą **`</>`** (Web app).
3. Įveskite pavadinimą, pvz. `Looply Website` → **Register app**.
   (Firebase Hosting galite praleisti – jo nereikia, nes svetainė jau turi savo talpinimą.)
4. Firebase parodys kodo bloką `firebaseConfig`, panašų į šį:

```js
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "looply-atsiliepimai.firebaseapp.com",
  databaseURL: "https://looply-atsiliepimai-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "looply-atsiliepimai",
  storageBucket: "looply-atsiliepimai.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

5. **Nukopijuokite visą šį bloką.**

## 4 žingsnis – Įklijuokite raktus į svetainės kodą

1. Atsidarykite failą **`looply-reviews.js`** (pridėtas prie šio pokalbio).
2. Raskite viršuje sekciją, pažymėtą `1) FIREBASE KONFIGŪRACIJA`.
3. Pakeiskite visą `firebaseConfig` objektą tuo, kurį nukopijavote 3 žingsnyje – t. y. ištrinkite placeholder'ius (`"ČIA_ĮKLIJUOKITE..."`) ir įrašykite tikras reikšmes.
4. Išsaugokite failą ir įkelkite atnaujintą `looply-reviews.js` į savo serverį (ten pat, kur yra `index.html`).

## 5 žingsnis – Nustatykite saugumo taisykles (Rules)

1. Firebase Console → **Realtime Database → Rules** skiltis.
2. Įklijuokite šias taisykles:

```json
{
  "rules": {
    "atsiliepimai": {
      ".read": true,
      ".write": true
    }
  }
}
```

3. Spauskite **„Publish"**.

⚠️ **Svarbu suprasti:** kadangi svetainėje nėra vartotojų prisijungimo sistemos (login), šios taisyklės leidžia **bet kam** technine prasme rašyti į duomenų bazę tiesiogiai (ne tik per jūsų formą). „Redaguoti"/„Ištrinti" mygtukų slėpimas per `?admin=...` nuorodą apsaugo tik **vartotojo sąsają** (žmonės jų nematys), bet nėra tikra serverio pusės apsauga nuo techniškai išprusio žmogaus. Mažai/vidutinei verslo svetainei su atsiliepimais tai įprastas ir priimtinas rizikos lygis. Jei ateityje norėsite tikros apsaugos (kad tik jūs galėtumėte trinti), reikėtų pridėti Firebase Authentication – galiu padėti tai įgyvendinti atskirai.

## 6 žingsnis – Pakeiskite savo slaptą administratoriaus kodą

1. Faile `looply-reviews.js` raskite eilutę:
   ```js
   const ADMIN_SECRET = "secret123";
   ```
2. Pakeiskite `"secret123"` į savo unikalų, sunkiai atspėjamą kodą (pvz. `"lp_9x7Qz2v"`).
3. Norėdami matyti „Redaguoti"/„Ištrinti" mygtukus, į svetainę eikite per nuorodą:
   ```
   https://jusu-svetaine.lt/index.html?admin=lp_9x7Qz2v
   ```
   (pakeiskite domeną ir kodą į savo).

---

## Viskas paruošta ✅

Kai visi žingsniai atlikti:
- Atsiliepimų forma svetainėje pradės siųsti duomenis į jūsų Firebase duomenų bazę.
- Skaitiklis „Atsiliepimai: X" viršuje automatiškai atsinaujins.
- Visi lankytojai matys naujus atsiliepimus **realiu laiku**, be puslapio perkrovimo.
- Tik žinantys slaptą `?admin=...` nuorodą matys „Redaguoti“/„Ištrinti“ mygtukus.

**Nemokamo Firebase plano limitai** (Spark planas): iki 1 GB saugyklos ir 10 GB/mėn. duomenų srauto – mažam/vidutiniam atsiliepimų kiekiui to užteks su dideliu atsargos rezervu.

Jei kils klausimų diegiant – atsiųskite ekrano nuotrauką ir padėsiu.
