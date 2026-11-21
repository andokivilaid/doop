import type { Catalog } from '..'

export const home: Catalog['home'] = {
  /* header */
  import: 'Impordi',
  newCanvas: 'Uus lõuend',
  newShort: 'Uus',
  hidePromptBox: 'Peida viibakast',
  hidePromptBoxTitle: 'Kas peita viibakast?',
  hidePromptBoxLede:
    'See eemaldab viibakasti sinu avalehelt. Saad selle igal ajal tagasi lülitada jaotises Seaded → Üldine.',

  /* failures and toasts */
  createCanvasFailed: 'Lõuendi loomine ebaõnnestus',
  startCanvasFailed: 'Lõuendi alustamine ebaõnnestus',
  startImportFailed: 'Importimise alustamine ebaõnnestus',
  briefNotQueued: 'Lähteülesanne ei jõudnud järjekorda — proovi uuesti saata',
  duplicateFailed: 'Lõuendi dubleerimine ebaõnnestus',
  shareFailed: 'Jagamise avamine ebaõnnestus',
  linkCopied: 'Lõuendi link kopeeritud',
  movedTo: 'Teisaldatud: {name}',
  movedToFallback: 'tööruum',
  movedToPersonal: 'Teisaldatud: Isiklik',

  /* upgrade reasons */
  reasonAddCanvas: 'Lõuendi lisamiseks tööruumi on vaja Pro plaani.',
  reasonMoveCanvas: 'Lõuendi teisaldamiseks tööruumi on vaja Pro plaani.',
  reasonWorkspaceReady: '„{name}“ on valmis — vali plaan, et seda kasutama hakata.',

  /* scopes */
  ownedByMe: 'Minu omad',
  sharedWithMe: 'Minuga jagatud',
  allCanvases: 'Kõik lõuendid',

  /* a workspace without a plan */
  noPlanTitle: 'Tööruumil {name} pole veel plaani.',
  noPlanAskOwner: 'Palu omanikul plaan valida — seni ei saa siia lõuendeid lisada.',
  noPlanChoose: 'Vali Pro plaan, et lisada lõuendeid ja kutsuda oma meeskond.',
  choosePlan: 'Vali plaan',

  /* list header */
  people: { one: '{count} inimene', other: '{count} inimest' },
  teamPlan: 'Pro plaan',
  sharedWorkspace: 'Jagatud tööruum',
  noPlanYet: 'Plaani veel pole',
  sortAria: 'Sortimine: {label}',
  sortUpdated: 'Viimati muudetud',
  sortName: 'Nimi',
  sortCreated: 'Uusimad',
  viewAria: 'Vaade',
  gridView: 'Ruudustikuvaade',
  listView: 'Loendivaade',

  /* list body */
  emptyTitle: 'Alusta oma esimest lõuendit',
  emptyDescription:
    'Lõuend on ühine ruum elavatele HTML-raamidele — sina kujundad brauseris, sinu AI-agendid kujundavad MCP kaudu ja kõik näevad kõike reaalajas.',
  createCanvas: '+ Loo lõuend',
  nothingHere: 'Siin pole veel midagi — proovi teist vaadet.',
  createNewCanvasAria: 'Loo uus lõuend',
  frames: { one: '{count} raam', other: '{count} raami' },

  /* delete */
  deleteTitle: 'Kas kustutada „{name}“?',
  deleteFallbackName: 'lõuend',
  deleteDescription: 'See kustutab lõuendi ja kogu selle sisu jäädavalt. Seda ei saa tagasi võtta.',
  deleteConfirm: 'Kustuta lõuend',

  /* tile meta */
  claimTitle: 'See lõuend on pärit ajast enne kontosid ja on kõigile nähtav. Võta see endale.',
  claimBadge: 'omanikuta — võta endale',
  sharedByTitle: 'Sind kutsuti sellel lõuendil kaasa töötama',
  sharedBy: 'Jagas: {name}',
  edited: 'Muudetud {time}',
  inWorkspace: 'Tööruumis {workspace}',

  /* canvas actions */
  actionsFor: 'Toimingud: {name}',
  share: 'Jaga',
  duplicating: 'Dubleerin…',
  duplicate: 'Dubleeri',
  move: 'Teisalda…',
  moveToWorkspace: 'Teisalda tööruumi…',

  /* hero */
  greeting: 'Küsi, mida kujundada',
  chipLanding: 'Koosta maandumisleht',
  chipLandingPrompt: 'Koosta maandumisleht: ',
  chipAutomation: 'Käivita automaatika',
  chipAgents: 'Ühenda oma agendid',
  chipImport: 'Impordi kujundus',
  chipIntegrations: 'Avasta integratsioone',
  chipTemplates: 'Avasta malle',
  composerPlaceholder: 'Kirjelda ekraanivaadet, voogu või tervet saiti…',
  composerAria: 'Küsi Doopilt, mida kujundada',
  attachTitle: 'Lisa kujundus, millest alustada',
  files: 'Failid',
  draftsAria: 'Mustandeid viiba kohta: {count}',
  drafts: { one: '{count} mustand', other: '{count} mustandit' },
  draftsCaption: 'Mustandeid viiba kohta',
  draftsDescription: { one: 'Üks lahendus lähteülesandele', other: '{count} lahendust kõrvuti, et valida' },
  draftsCustom: 'Kohandatud',
  draftsCustomDescription: 'Mis tahes arv',
  draftsFewer: 'Vähem mustandeid',
  draftsMore: 'Rohkem mustandeid',
  draftsCustomAria: 'Kohandatud mustandite arv',
  send: 'Saada',
  connectDesigns: 'Ühenda oma olemasolevad kujundused, et saada paremaid tulemusi',

  /* agent allowance */
  meterGeminiCloud: 'Doop Agent sinu Gemini pilveühendusel',
  meterClaudeLocal: 'Doop Agent sinu kohalikul Claude CLI-l',
  meterChatgpt: 'Doop Agent sinu ChatGPT-l',
  meterProviderKey: 'Doop Agent sinu {provider} võtmel',
  meterCustomProvider: 'Doop Agent teenusepakkujal {provider}',
  meterCustomProviderUnnamed: 'Doop Agent sinu kohandatud teenusepakkujal',
  meterNoFreeTier: 'Doop Agenti kasutamiseks ühenda seadetes plaan',
  meterUsedUp: 'Tasuta Doop Agenti ülesanded on otsas — jätkamiseks ühenda ChatGPT',
  meterUsedUpLine: 'tasuta Doop Agenti ülesanded on otsas — jätkamiseks ühenda ChatGPT',
  meterLeft: {
    one: 'Tasuta Doop Agenti ülesandeid alles: {left}/{count}',
    other: 'Tasuta Doop Agenti ülesandeid alles: {left}/{count}',
  },
  wallUsedUpTitle: 'Sinu tasuta Doop Agenti ülesanded on otsas',
  wallConnectTitle: 'Doop Agenti kasutamiseks ühenda plaan',
  wallUsedUpBefore: 'Need olid meie kulul. Ühenda oma',
  wallUsedUpBold: 'ChatGPT tellimus',
  wallUsedUpAfter:
    'ja Doop Agent töötab edasi täpselt nagu praegu — sama lõuend, sama agent, aga meie plaani asemel sinu plaanil.',
  wallConnectBefore: 'Doop Agent kujundab sinu lõuenditel, kasutades tellimust, mis sul juba on. Ühenda',
  wallConnectAfter: 'üks kord ja iga ülesanne töötab sinu plaanil — midagi ei mõõdeta ega eraldi arvet ei tule.',
  wallConnectButton: 'Ühenda oma plaan',
  wallMcp:
    'Eelistad juhtida lõuendit ise Claude Code’ist, Codexist või mõnest teisest MCP kliendist? See agent kujundab nii, nagu sa seda juhendad — järjekorras ülesanded jäävad Doop Agentile.',
  wallMcpLink: 'Vaata, kuidas seda ühendada',

  /* create a workspace */
  workspacesEyebrow: 'Tööruumid',
  nameWorkspace: 'Anna tööruumile nimi',
  createWorkspaceLede:
    'Tööruum on sinu meeskonna ühine kodu: kõik selle liikmed saavad avada iga selles oleva lõuendi. Olemasolevad lõuendid saad sinna hiljem teisaldada.',
  workspaceNameAria: 'Tööruumi nimi',
  creating: 'Loon…',
  createWorkspace: 'Loo tööruum',
  createWorkspaceFailed: 'Tööruumi loomine ebaõnnestus',

  /* the upgrade wall */
  plansFor: 'Plaanid: {name}',
  unlock: 'Ava {name}',
  plans: 'Plaanid',
  upgradeDefaultReason: 'Jagatud tööruumid on Doopi tasuline osa.',
  upgradeLede:
    'Kõik tööruumi liikmed saavad avada iga selles oleva lõuendi — pole vaja iga lõuendi kaupa kutsuda ega linke jagada. Kasutajakohtade eest esitatakse arve liitumisel ja raha tagastatakse lahkumisel.',
  billingOff:
    'Selles serveris pole arveldust seadistatud, seega on tööruumid hinna sees. Midagi pole vaja osta — loo üks.',
  monthly: 'Kuupõhine',
  yearly: 'Aastapõhine',
  yearlyPrice: '{perMonth} kasutaja kohta kuus, arve {perYear} aastas',
  monthlyPrice: '{price} kasutaja kohta, arve kord kuus',
  totalPerMonth: '= {total} kuus',
  totalPerYear: '= {total} aastas',
  alreadyOnTeam: ' — juba Pro plaanil; halda seda arvelduse all.',
  countingSeats: 'Loen kasutajakohti…',
  stripeNote: 'Makse seadistad Stripe’i turvalises maksekeskkonnas. Saad igal ajal arveldusportaalis tühistada.',
  askOwnerBefore: 'Palu, et',
  askOwnerAfter: 'valiks plaani — arveldus on omaniku käes.',
  workspaceOwnerFallback: 'tööruumi omanik',
  openingStripe: 'Avan Stripe’i…',
  continueCheckout: 'Jätka maksmisega',
  checkoutFailed: 'Maksmise alustamine ebaõnnestus',
  popular: 'Populaarne',
  current: 'Praegune',
  letsTalk: 'Räägime',
  perSeatMonth: '/ kasutaja / kuu',
  billedYearly: 'arve {price} kasutaja kohta aastas',
  contactUs: 'Võta ühendust',

  /* move a canvas */
  moveTitle: 'Teisalda „{name}“',
  moveLede:
    'Tööruumis olev lõuend on avatud kõigile selle liikmetele. Teisalda see tagasi isiklikku ruumi ja ligipääs jääb ainult sulle ja sinu kutsutud inimestele.',
  destinationAria: 'Sihtkoht',
  personalOption: 'Isiklik — ainult sina ja kutsutud',
  needsPlanSuffix: ' (vajab plaani)',
  targetNoPlan: 'Tööruumil {name} pole veel plaani — sul palutakse see valida.',
  moving: 'Teisaldan…',
  moveCanvas: 'Teisalda lõuend',
  moveFailed: 'Lõuendi teisaldamine ebaõnnestus',
}
