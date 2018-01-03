title: "Z Lilien je hvězda, Lída se vrací na výsluní, Ivan patří minulosti. A jak šlo v čase vaše jméno?"
perex: "Podle nejčerstvějších dat mají Češi 69 537 různých křestních jmen. Jejich oblíbenost kolísá s aktuální módou i dobovými poměry. Podle jména tak lze odhadnout i to, jak je jeho nositel starý. Která jména jsou neotřelou novinkou a která patří do historie? A jak daleko máte k průměrnému nositeli svého jména vy?"
authors: ["Michal Zlatkovský"]
published: "3. ledna 2018"
coverimg: https://interaktivni.rozhlas.cz/brexit/media/cover.jpg
coverimg_note: "Foto <a href='#'>ČTK</a>"
styles: []
libraries: [jquery, "https://code.highcharts.com/highcharts.js", "https://code.highcharts.com/highcharts-more.js"]
options: ""
---

Koho si představíte pod jmény Marie, Ludmila, Alois nebo Leopold? Nejspíš zástupce dnešní generace dědečků a babiček, dost možná i praprarodičů. Natálie, Dominik, Sebastian nebo Emma jsou oproti tomu jména jako vystřižená z prostředí dnešních základních a středních škol. A zatímco jste na českém území mohli za druhé světové války narazit na novorozence jménem Ingeborg nebo Waltraud, dnes v porodnicích uvidíte spíše Isabelly, Vivien nebo Christiany.

Vzestupy a pády křestních jmen dokumentují podrobná data, která pravidelně vydává [ministerstvo vnitra](http://www.mvcr.cz/clanek/cetnost-jmen-a-prijmeni-722752.aspx). Ta jsme zpracovali do interaktivní miniaplikace, ve které můžete prozkoumat popularitu Vašeho nebo jakéhokoliv jiného jména. Aplikace zobrazí graf popularity jména i medián roku narození jeho nositelů - tedy rok, před nímž i po němž se narodila právě polovina lidí s daným jménem. 

<div class="ui-widget">
  <label for="name1">Jméno 1: </label>
  <input id="name1" class="nameac">
  <label for="name2">Jméno 2: </label>
  <input id="name2" class="nameac">
</div>
<div id="appchart"></div>
<div id="median1info" class="medianinfo"></div>
<div id="median2info" class="medianinfo"></div>

Data ukazují chvilkovou popularitu jmen ovlivněných filmy nebo televizními pořady i vlivy cizích jazyků a kultur. Mezi ty první patří například Angelika po vzoru protagonistky [francouzského filmu ze šedesátých let](https://www.csfd.cz/film/37676-angelika-markyza-andelu/prehled/) nebo Aneta, jméno nejpopulárnější v roce 2004 po výhře Anety Langerové v soutěži Česko hledá Superstar. 

Vůbec nejvýraznější historickou kapitolu tvoří neměcká jména, na území Česka rozšířená do konce druhé světové války. Kromě těch zmíněných to jsou třeba Helmut, Reinhold nebo Irmgard - a nepřekvapivě také Adolf, nejoblíbenější v roce 1939. Po válce tato jména takřka vymizela. Ivana, jméno známé z ruské pohádky Mrazík, zase potkal strmý pád popularity po sovětské invazi roku 1968.

Zásadní trend se ovšem týká až poslední doby: kreativita rodičů v pojmenování potomků za posledních dvacet let strmě narostla. Počet různých jmen, které novorozenci dostávají, je dnes skoro třikrát vyšší než v devadesátých letech.

<div id="uniqnames"></div>

Patrné je to na "nejmladších" ženských jménech, tedy těch, jejichž nositelky jsou v průměru osmileté a mladší.  Stejně jako u všech následujících údajů jsme vybrali jména s více než 1000 nositeli.
<div id="youngest-female"></div>
počítáme jména s víc než 1000 nositeli:

Mezi známější "stará" ženská jména patří Blažena a Božena (medián 72 let) i Marie, Milada nebo Zdenka (medián 69 let).
<div id="oldest-male"></div>
<div id="oldest-female"></div>

Nejmladší:
<div id="youngest-male"></div>



Nejstálejší jména/vrací se do módy.  uuu
<div id="evergreen"></div>


Nejpopulárnější jména:
<div id="popular"></div>

Data MVČR. Inspirováno [FiveThirtyEight](https://fivethirtyeight.com/features/how-to-tell-someones-age-when-all-you-know-is-her-name/).