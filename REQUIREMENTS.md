# Krav och design

## Funktionella krav

### Allmänt

- Alla texter på sajten ska vara på svenska.

### Recept

Ett recept ska innehålla följande obligatoriska fält:

- Titel
- Ingredienslista
- Steg-för-steg-guide hur man tillagar receptet
- En bild

Ett recept kan även innehålla följande:

- En eller flera kategorier (t.ex. middag, frukost, lunch, snack, mellanmål, fika)
- En eller flera taggar (t.ex. snabblagat, vegetariskt, jul)
- Beskrivning
- Tid det tar att laga receptet i minuter

### Recepthantering

- Det ska gå att lägga till ett recept genom att ta en eller flera bilder med mobilkameran och ladda upp dessa.
- Det ska gå att lägga till ett recept genom att klistra in eller dela en URL och innehållet på den länkade sidan läses in.
- Det ska gå att skriva ett recept manuellt.
- Det ska gå att lägga till ett recept genom att klistra in oformatterad text som innehåller ingredienser och steg-för-steg-guide.
- Det ska gå att ta bort ett helt recept. Receptet arkiveras då och visas inte för användaren men finns fortfarande åtkomligt i ett arkiv i administrationsläge.
- Om informationen som laddas upp när ett recept ska läggas till saknar en bild ska en bild genereras eller så ska en standardbild användas.

### Konto- och användarhantering

- För att använda webbsajten behöver användaren vara inloggad.
- Användaren loggar in genom att fylla i sin e-postadress. Ett mejl skickas med en länk som användaren klickar på för att logga in.
- Användaren skapar sitt konto genom att ange sin e-postadress. Ett mejl skickas med en länk som användaren klickar på för att skapa kontot. Användaren fyller i sitt för- och efternamn vid kontoSkapandet.
- Det ska gå att helt ta bort sitt konto. All information — användardata, kontoinformation och recept — raderas då.

### Administration

- Det ska finnas ett speciellt administrationsläge för användare med administratorrollen.
- Administratorrollen specificeras genom en lista av e-postadresser i en miljövariabel på servern.
- En administrator ska kunna se alla användare.
- En administrator ska kunna ta bort en användare.

## Datamodell

Alla egenskaper i kod ska vara på engelska.

### Recipe

| Fält | Typ | Krav |
|---|---|---|
| Id | int | unique, required |
| Title | string | required |
| UrlSlug | string | unique, required |
| Ingredients | Ingredient[] | |
| Steps | Step[] | |
| Tags | Tag[] | |
| Categories | Category[] | |
| CookingTimeMinutes | int | |
| Author | User | required |
| SharedWith | User[] | |

### Ingredient

| Fält | Typ | Krav |
|---|---|---|
| Id | int | unique, required |
| Name | string | unique, required |

### User

| Fält | Typ | Krav |
|---|---|---|
| Id | int | unique, required |
| EmailAddress | string | unique, required |
| FirstName | string | |
| LastName | string | |

### Category

| Fält | Typ | Krav |
|---|---|---|
| Id | int | unique, required |
| Name | string | unique, required |
| SvgIcon | string | |

## UX

### Stil

Övergripande stil: **"premium men mänsklig"**

- Ljus och luftig
- Bildcentrerad
- Mjukt rundad
- Varm och inbjudande
- Konsekvent minimalistisk

Förebild: [Airbnb](https://www.airbnb.se) — kortbaserat grid, stora bilder, rundade hörn, varm korallfärg som accent, vit bakgrund och generöst whitespace.

### Sidstruktur

- **Header** — sajtnamnet "Mina recept", inloggnings-/utloggningsknapp, eventuell meny
- **Huvudarea** — sajtens funktionalitet
- **Footer** — längst ner på sidan

### Receptvisning

**I listvyer:** kortbaserad layout med receptnamn, bild, kategorier och taggar.

**I detaljvy:** receptnamn, ingredienslista, steg-för-steg-guide, kategorier och taggar.

### Lägga till recept

**Via bilder:** användaren tar bilder med kameran eller laddar upp filer. Bilderna visas i en lista där enskilda bilder kan tas bort. Uppladdning sker först när användaren bekräftar.

**Via URL:** användaren klistrar in en URL som sajten hämtar och tolkar.

**Via manuell inmatning:** formulär med alla fält. Ingredienser och steg kan läggas till och tas bort under inmatningen.

**Via oformatterad text:** användaren klistrar in text i en textruta som sajten tolkar till ett recept.

## AI-funktioner

- Tolka recept från bilder, URL och oformatterad text.
- Generera en bild för recept som saknar bild, baserat på ingredienser och steg.
- Föreslå kategorier och taggar — prioritera befintliga i databasen och föreslå nya bara när ingen passar.
