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
}
