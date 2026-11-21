import type { Catalog } from '..'

export const settings: Catalog['settings'] = {
  sectionLabel: 'Seaded',
  backToCanvases: 'Tagasi lõuendite juurde',
  backToCanvas: 'Tagasi lõuendile',
  canvases: 'Lõuendid',
  canvas: 'Lõuend',

  generalTitle: 'Üldine',
  generalBlurb: 'Sea Doop selles brauseris endale meelepäraseks.',
  homeDashboardTitle: 'Avalehe töölaud',
  homeDashboardDescription: 'Vali, mida sinu avalehe töölaual selles brauseris näidatakse.',
  showPromptBox: 'Näita viibakasti',
  showPromptBoxHint: 'Alusta avalehe töölaual kujundust viibast.',
  agentTitle: 'Doop Agent',
  agentBlurb:
    'Sinu ühendused ja see, mille peal agent töötab, kui keegi ei vali: kommentaarid, @mainimised ja automatiseerimised.',
  fontsTitle: 'Fondid',
  fontsBlurb: 'Sinu enda fondid, kujundamiseks isiklikel lõuenditel.',
  keysTitle: 'Agendivõtmed',
  keysBlurb: 'Bearer-volitused, mis lasevad liideseta agentidel sinu nimel kujundada.',
  webhooksTitle: 'Veebihaagid',
  webhooksBlurb: 'HTTP-kutsed sinu süsteemidesse, kui sulle avataval lõuendil midagi juhtub.',
  accountTitle: 'Sinu konto',
  accountTab: 'Konto',
  accountBlurb: 'Kes sa oled igal lõuendil — ja kuidas sa siia tagasi pääsed.',
  appearanceTitle: 'Välimus',
  appearanceBlurb:
    'Kuidas Doop selles brauseris välja näeb: hele või tume ning kuidas lõuendiredaktor oma paneele paigutab.',

  freeTasksLeftLabel: 'Tasuta Doop Agenti ülesandeid alles',
  meterGeminiCloud: 'Valitud on Gemini pilvepiloot — ühendust haldab sinu operaator.',
  meterNoFreeTasks: 'Selles serveris tasuta ülesandeid pole — Doop Agenti kasutamiseks ühenda konto.',
  meterUsedUp: 'Sinu tasuta ülesanded on otsas.',
  meterLeft: {
    one: '{count}-st tasuta ülesandest on alles {left}.',
    other: '{count}-st tasuta ülesandest on alles {left}.',
  },

  imageDescriptionsTitle: 'Piltide kirjeldused',
  imageDescriptionsDescription:
    'Agendid saavad iga üleslaaditud pildi kohta lühikirjelduse, et teada, mis seal on, ilma seda avamata.',
  imageDescriptionsRow: 'Kirjelda mudeliga',
  imageDescriptionsAria: 'Piltide kirjeldused',
  imageDescriptionsOff: 'Väljas',
  imageDescriptionsAccount: 'Minu mudel',
  imageDescriptionsServer: 'Serveri mudel',
  imageDescriptionsRunsOn: 'Valmis: {label}',
  imageDescriptionsAccountNote:
    'Töötab sinu ühendatud kontol ja katab ka üleslaadimised sinu lõuenditele, kui üleslaadijal mudelit pole. Kehtivad sinu teenusepakkuja tasud.',
  imageDescriptionsServerNote: 'Töötab selle serveri mudelil. Sinu kontolt tasu ei võeta.',
  imageDescriptionsFallbackNote:
    'Ükski sinu ühendatud konto ei näe pilte, seega kasutatakse sinu üleslaadimiste puhul selle serveri mudelit ja sinu kontolt tasu ei võeta. Ühenda mõni konto, et seda kasutada.',
  imageDescriptionsReasonOff: 'Sinu üleslaadimisi ja sinu lõuendite pilte ei kirjeldata.',
  imageDescriptionsReasonTextOnly:
    'Sinu kontol pole pilte nägevat mudelit ja selles serveris samuti mitte. Lõuendi omanik, kuhu pildi üles laadid, võib selle siiski katta; muidu jäävad pildid kirjelduseta.',
  imageDescriptionsReasonNoModel:
    'Selleks pole ühtegi mudelit saadaval. Valikuga Minu mudel võib lõuendi omanik, kuhu pildi üles laadid, selle siiski katta.',
  imageDescriptionsHowTitle: 'Kes kirjelduse eest maksab',
  imageDescriptionsHow:
    'Valikuga Minu mudel kirjeldatakse pilti üleslaadija kontol, selle puudumisel lõuendi omaniku kontol, viimasena selle serveri mudeliga. Serveri mudel kasutab ainult seda serverit ja jätab sinu konto sellest järjekorrast välja. Väljas peatab kirjeldused sinu üleslaadimistele ja sinu lõuenditele. Kordusprooviga maksab see, kes maksis esimese katse eest.',

  themeTitle: 'Teema',
  themeDescription:
    'Hele või tume, igal lõuendil ja lehel selles brauseris. Süsteem järgib sinu operatsioonisüsteemi ja vahetub koos sellega.',
  themeRow: 'Välimus',
  themeAria: 'Teema',
  themeSystem: 'Süsteem',
  themeLight: 'Hele',
  themeDark: 'Tume',
  themeFollowingSystem: 'Järgib süsteemi — praegu {resolved}.',
  themeResolvedLight: 'hele',
  themeResolvedDark: 'tume',
  themeSetByHand: 'Määratud käsitsi — süsteemi seadet eiratakse.',

  languageTitle: 'Keel',
  languageDescription:
    'Keel, milles Doopi vaated selles brauseris on. Kuni sa keelt ei vali, näed selle serveri vaikekeelt.',
  languageRow: 'Keel',
  languageAria: 'Keel',
  languagePicked: 'Valitud selles brauseris.',
  languageServerDefault: 'Serveri vaikekeel — vali keel, et see selles brauseris säiliks.',

  panelsTitle: 'Lõuendi paneelid',
  panelsDescription:
    'Kuidas lõuendiredaktor paigutab selles brauseris kihid, inspektori ja agendid. Hõljuvad paneelid on lõuendi kohal; dokitud paneelid on vastu akna servi ja lõuend jääb nende vahele.',
  panelsRow: 'Paigutus',
  panelsAria: 'Lõuendi paneelid',
  panelsFloating: 'Hõljuvad',
  panelsDocked: 'Dokitud',
  panelsFloatingNote: 'Paneelid hõljuvad lõuendi kohal.',
  panelsDockedNote: 'Paneelid on dokitud servadesse.',
}
