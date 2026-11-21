import type { Catalog } from '..'

export const agents: Catalog['agents'] = {
  title: 'Agentide tiim',
  descriptionWorkspace: 'Doop Agenti tiim selle tööruumi igal lõuendil.',
  descriptionPersonal: 'Doop Agenti tiim sinu isikliku ruumi lõuenditel.',
  descriptionRest:
    'Lülita välja sisseehitatud agendid, mida sa ei vaja, muuda nende tööviisi või lisa oma. Inimesed pöörduvad agendi poole, @mainides seda kommentaaris või viibakastis, ja automatiseerimised saavad talle sammu üle anda.',
  builtIn: 'Sisseehitatud',
  builtInNote:
    'Väljalülitatud agent kaob mainimiste loendist ja automatiseerimise sammudest; teda ootav töö läheb Doopile.',
  off: 'Väljas',
  edited: 'Muudetud',
  toggle: 'Kasuta agenti {name}',
  defaultStaysOn: 'Doop jääb sisse: kellelegi suunamata töö läheb talle.',
  builtInLede:
    'Muuda, kuidas see sisseehitatud agent selles tiimis töötab. Sinu juhised asendavad tema algsed juhised; Lähtesta toob need tagasi.',
  reset: 'Lähtesta vaikeseadele',
  yours: 'Kohandatud',
  loading: 'Laadimine…',
  count: { one: '{count} kohandatud agent', other: '{count} kohandatud agenti' },
  full: 'Tiim on täis: {count} kohandatud agenti. Uue lisamiseks eemalda üks.',
  add: 'Lisa agent',
  edit: 'Muuda',
  remove: 'Eemalda',
  emptyTitle: 'Kohandatud agente veel pole',
  emptyPersonal:
    'Lisa spetsialist, keda sisseehitatud tiimis pole, näiteks SEO-ülevaataja või sinu brändi hääl, ja @maini teda oma isiklikel lõuenditel.',
  emptyWorkspace:
    'Lisa spetsialist, keda sisseehitatud tiimis pole, näiteks SEO-ülevaataja või sinu brändi hääl, ja kõik tööruumi liikmed saavad teda @mainida.',
  reviewerBadge: 'Ülevaatus: võib lõpetada midagi muutmata',
  loadFailed: 'Kohandatud agente ei õnnestunud laadida.',
  removeFailed: 'Agenti ei õnnestunud eemaldada. Proovi uuesti.',
  saveFailed: 'Agenti ei õnnestunud salvestada. Proovi uuesti.',
  removeTitle: 'Kas eemaldad agendi {name}?',
  removeDescription:
    'Ta lõpetab @mainimistele vastamise ja kaob automatiseerimise sammuvalijast. Teda veel ootav töö läheb Doopile ja juba tehtu jääb alles.',
  addTitle: 'Lisa kohandatud agent',
  editTitle: 'Muuda agenti {name}',
  formLede: 'Spetsialist Doop Agenti tiimis. Tema juhised lisatakse agendi viibale iga kord, kui ta töötab.',
  name: 'Nimi',
  namePlaceholder: 'SEO-ülevaataja',
  fixedHint: 'Nimi ja pidenimi jäävad samaks: avatud kommentaarid ja kaardid viitavad neile.',
  handle: 'Pidenimi',
  blurb: 'Üherealine kirjeldus',
  blurbPlaceholder: 'Pealkirjad, alapealkirjad ja metatekstid otsingu jaoks',
  brief: 'Juhised',
  briefPlaceholder:
    'Sa oled SEO-ülevaataja. Kontrolli, et igal lehel oleks üks selge h1, kirjeldavad pealkirjad õiges järjekorras ja tekst, mis nimetab, millest leht räägib…',
  briefHint: '{used} / {max} märki. Ütle, mille eest ta vastutab, mida ta kontrollib ja mida ta peab rahule jätma.',
  color: 'Värv',
  reviewer: 'Ülevaatus',
  reviewerHint:
    'Ta hindab olemasolevat tööd ja võib lõpetada ilma muudatuseta, kui raam juba vastab tema nõuetele. Jäta välja agendi puhul, kes asju loob.',
  save: 'Salvesta',
  create: 'Lisa agent',
  saving: 'Salvestamine…',
  skillsTitle: 'Disaini- ja frontend-oskused',
  skillsDescriptionWorkspace:
    'Käsitööreeglid, mis saadetakse automaatselt igale MCP koodiagendile ja Doop Agentile selle tööruumi lõuenditel.',
  skillsDescriptionPersonal:
    'Käsitööreeglid, mis saadetakse automaatselt igale MCP koodiagendile ja Doop Agentile sinu isiklikel lõuenditel.',
  skillsDescriptionRest:
    'Lülita sisseehitatud pakke sisse või välja, kohanda reegleid oma tehnoloogiapinu järgi või lisa enda omi.',
  skillsBuiltIn: 'Sisseehitatud pakid',
  skillsBuiltInNote:
    'Sisselülitatud pakid liiguvad kaasa get_canvas vastuses ja agendi jooksutustes, et tüpograafia, disainimärkide, WCAG ja mobiilireeglid rakenduksid kohe.',
  skillsToggle: 'Luba {name}',
  skillsAdd: 'Lisa oskus',
  skillsCreate: 'Lisa oskus',
  skillsCount: { one: '{count} kohandatud oskus', other: '{count} kohandatud oskust' },
  skillsFull: 'Kohandatud oskuste piir ({count}) on täis. Uue lisamiseks eemalda üks.',
  skillsEmptyTitle: 'Kohandatud oskusi veel pole',
  skillsEmptyPersonal:
    'Lisa oma isiklike lõuendite jaoks repopõhised frontend-tavad (nt shadcn/ui, Vue, Svelte või animatsioonireeglid).',
  skillsEmptyWorkspace:
    'Lisa kogu tööruumi lõuendite jaoks ühised frontend-tavad (nt komponentide impordid, CSS-arhitektuur või tõlkereeglid).',
  skillsLoadFailed: 'Agendi oskusi ei õnnestunud laadida.',
  skillsSaveFailed: 'Oskust ei õnnestunud salvestada. Proovi uuesti.',
  skillsRemoveFailed: 'Oskust ei õnnestunud eemaldada. Proovi uuesti.',
  skillsRemoveTitle: 'Kas eemaldad oskuse {name}?',
  skillsRemoveDescription: 'Ühendatud agendid ei saa seda oskuspakki enam uutel jooksutustel.',
  skillsAddTitle: 'Lisa kohandatud oskus',
  skillsBuiltInLede: 'Kohanda seda sisseehitatud oskuspakki oma lõuendite jaoks. Lähtesta taastab algsed reeglid.',
  skillsFormLede:
    'Praktilised Markdown-reeglid, mis saadetakse automaatselt ühendatud koodiagentidele ja Doop Agentile.',
  skillsTitlePlaceholder: 'Disainisüsteemi reeglid',
  skillsSlug: 'Tunnus',
  skillsSlugFixedHint: 'Tunnus jääb pärast loomist samaks, et get_skill päringud püsiksid töökindlad.',
  skillsSummaryPlaceholder: 'Komponentide impordid, vahemärgid ja vormide valideerimise mustrid',
  skillsMarkdown: 'Oskuse reeglid (Markdown)',
  skillsMarkdownPlaceholder: '### Komponentide tavad\n- Eelista semantilisi <button> ja <dialog> elemente…',
  skillsMarkdownHint:
    '{used} / {max} märki. Kirjuta konkreetsed reeglid, mida agendid saavad kontrollida nii pildil kui ka koodis.',
}
