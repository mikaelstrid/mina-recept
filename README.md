# Mina recept

## Översikt

Mina recept är en webbsajt som innehåller ett bibliotek över mina favoritrecept. Det är enkelt att hitta ett recept genom att antingen söka med fritext eller bläddra via kategorier, ingredienser och taggar.

Nya recept läggs enkelt till genom att man antingen tar en bild på ett recept, laddar upp en URL eller manuellt skriver in ett recept.

Mina recept är speciellt anpassad för att användas i mobilen när man lagar mat eller är i affären men det finns även ett mer utförligt och överskådligt desktopläge.

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
- Tid det tar att laga receptet i minuter.

### Recepthantering

- Det ska gå att lägga till ett recept genom att ta en eller flera bilder med mobilkameran och ladda upp dessa.
- Det ska gå att lägga till ett recept genom att klistra in eller dela en URL (webbadress) och innehållet på den länkade sidan läses in.
- Det ska gå att skriva ett recept manuellt.
- Det ska gå att lägga till ett recept genom att klistra in oformatterad text som innehåller ingredienser och steg-för-steg-guide.
- Det ska gå att ta bort ett helt recept. Receptet arkiveras då och visas inte för användaren men finns fortfarande åtkomligt i ett arkiv i administrationsläge.
- Om informationen som laddas upp när ett recept ska läggas till saknar en bild ska en bild genereras eller så ska en standardbild användas.

### Konto- och användarhantering

- För att använda webbsajten behöver användaren vara inloggad.
- Användaren loggar in genom att fylla i sin e-postadress. Ett mejl skickas till den angivna e-postadressen med en länk som användaren klickar på för att logga in.
- Användaren skapar sitt konto genom att ange sin e-postadress. Ett mejl skickas till den angivna e-postadressen med en länk som användaren klickar på för att skapa kontot. Användaren får fylla i sitt för- och efternamn när hen skapar kontot.
- Det ska gå att helt ta bort sitt konto. All information, det vill säga all användarinformation, kontoinformation och recept, raderas då.

### Administration

- Det ska finnas ett speciellt administrationsläge för användare som har administratorrollen.
- Administratorrollen specificeras genom en lista av e-postadresser som läggs i en miljövariabel på servern (eller liknande) där webbsajten körs.
- En administrator ska kunna se alla användare.
- En administrator ska kunna ta bort en användare.

## UX

### Stil

Övergripande stil: “premium men mänsklig”

- **Ljus och luftig**
- **Bildcentrerad**
- **Mjukt rundad**
- **Varm och inbjudande**
- **Konsekvent minimalistisk**

Det är en UX som vill kännas **personlig och trygg**, snarare än teknisk eller transaktionell.

#### Förebild

Airbnbs webbsajt (https://www.airbnb.se) används som en förebild när det kommer till det visuella intrycket.

Airbnbs UX på startsidan du har öppen är väldigt konsekvent och genomtänkt — och den följer en tydlig visuell identitet som kombinerar **minimalism**, **varma accenter** och **mjuka former**. Här är en strukturerad genomgång av hur den visuella upplevelsen faktiskt framstår baserat på innehållet i fliken   [airbnb.se](https://www.airbnb.se).

##### 🎨 Färgpalett: varm, luftig och avskalad
Airbnb lutar tungt på en **ljus, nästan helt vit bakgrund** som ger maximal andningsyta. Det gör att bilderna på boenden blir huvudfokus.

- **Primärfärg:** Airbnb’s korallrosa (Rausch) används sparsamt — mest i logotypen och vissa CTA‑element.
- **Textfärger:** Mörkgrå och svart för hög läsbarhet.
- **Accenter:** Ljusgrå linjer och subtila skuggor för att separera sektioner utan att kännas kantigt.

Effekten är en **ren, modern och varm** känsla som undviker allt som känns “corporate”.

##### 🧱 Form och layout: kortbaserad, modulär, bilddriven
Startsidan är uppbyggd av **stora bildkort** med rundade hörn. Det är en av Airbnbs signaturer.

- **Rundade hörn** på kort, knappar och bilder → mjuk, välkomnande känsla.
- **Gridlayout** med jämna marginaler → lugn rytm, lätt att skanna.
- **Stora bilder** dominerar varje kort → emotionellt först, information sen.
- **Mycket whitespace** → premiumkänsla och fokus på innehållet.

Det är en layout som känns mer som ett galleri än en katalog.

##### 🔤 Typografi: enkel, neutral, konsekvent
Airbnb använder en **sans-serif** som är ren och lättläst, med tydlig hierarki:

- Stora rubriker i fet vikt
- Mindre metadata (datum, värdtyp, betyg) i tunnare vikt
- Priser i medium/fet vikt för att sticka ut

Det är funktionellt, men också elegant i sin enkelhet.

##### 🧭 Ikoner och mikrodetaljer: tunna linjer, lågmälda symboler
Ikonerna är **linjebaserade**, tunna och diskreta:

- Stjärnor för betyg
- Små punktavskiljare (·) mellan metadata
- Enkla pilar och filterikoner

De är designade för att **inte konkurrera med bilderna**, utan bara ge snabb orientering.

##### 🧩 Interaktionsdesign: subtil, men tydlig
Även om jag inte ser hover‑effekter direkt i koden, är Airbnbs mönster välkända:

- Kort får ofta en lätt skugga eller zoom vid hover
- Fokusmarkeringar är tydliga men inte skrikiga
- Knappar är platta, med rundade hörn och tydlig text

Det är en design som prioriterar **friktionlös navigation**.

### UX-delar

Webbsajten ska innehålla följande delar:

- En header med åtminstone:
  - Namnet på sajten "Mina recept"
  - Knapp för att logga in/logga ut
  - Eventuell meny
- En huvudarea där själva funktionalitet visas
- En avslutande footer längst ner på sidan

### Receptvisning

#### I listvyer och översikter

Använd en kortbaserad layout när ett recept visas i olika former av listvyer. Varje kort ska innehålla:

- Namnet på receptet
- En bild på receptet (om tillgänglig)
- Receptets kategorier, huvudingredienser och taggar

#### I detaljvyer

När ett enskilt recept visas så ska åtminstone följande information visas:

- Namnet på receptet
- Lista över ingredienser
- Steg-för-steg-guide hur man gör
- Kategorier, taggar, huvudingredienser

### Lägga till recept

#### Via bilder

Om man väljer att lägga till ett recept via bilder så ska användaren antingen kunna ta bilder direkt med kameran eller ladda upp som filer från sin telefon eller dator.

Man ska kunna lägga till en bild i taget och de valda bilderna visas i en lista där man kan ta bort bilder.

Slutligen bekräftar användaren bilderna och först då skickas de till sajten som processar dem.

#### Via URL

Användaren klistrar in en URL eller sökväg i ett textfält som skickas till sajten som processar den.

#### Via manuell inmatning

Användaren ska kunna fylla i alla fält via ett formulär och receptet sparas i databasen.

Ingredienslista och steg-för-steg-guide ska kunna redigeras under inmatningen genom att fält eller steg tas bort.

#### Via att klistra in oformatterad text

Användare klistrar in en större mängd mer eller mindre formatterad text i en textruta. 

Texten skickas till sajten som processar den till ett recept.

## Datamodell

Alla egenskaper i datamodellen som anges i kod ska vara på engelska.

### Recipe

- Id : int : unique : required
- Title : string : required
- UrlSlug : string : unique : required
- Ingredients: Ingredient[]
- Steps : Step[]
- Tags : Tag[]
- Categories : Category[]
- CookingTimeMinutes: int
- Author : User : required
- SharedWith : User[]

### Ingredient

- Id : int : unique : required
- Name : string : unique : required

### User

- Id : int : unique : required
- EmailAddress : string : unique : required
- FirstName : string
- LastName : string

### Category

- Id : int : unique : required
- Name : string : unique : required
- SvgIcon : string

## Implementation

### AI

Använd AI-modeller för att tolka data som användaren laddar upp. Detta gäller både när användaren laddar upp bilder såväl som när användaren anger en URL eller oformatterad text.

Använd AI-modeller för att generera en bild på ett recept när det saknas en bild. Basera bilden på ingredienserna samt steg-för-steg-guiden.

Föreslå kategorier och taggar med hjälp av AI-modeller för ett recept när det skapas. Basera kategorier och taggar främst på de som redan finns i systemet (databasen) men om det saknas lämlig kategori eller tagg så föreslå en ny.

## Teknikstack

### Applikationsramverk

Applikationen ska byggas med Next.js-ramverket.

### Infrastruktur

Applikationen ska köras i Microsoft Azure.

#### Web hosting

Applikationen ska installeras och köras på Azure Static Web Apps enligt hybrid-modellen, se https://learn.microsoft.com/en-us/azure/static-web-apps/nextjs.

#### AI-modeller

Använd AI-modeller i Microsoft Azure AI Foundry, se https://azure.microsoft.com/en-us/products/ai-foundry.

#### Datalagring

All data ska sparas i Microsoft Azure:

- Azure Table Storage : För JSON-data som beskriver själva recepten.
- Azure Blob Storage : För alla bilder 
