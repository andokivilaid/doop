import type { Catalog } from '..'

export const fonts: Catalog['fonts'] = {
  title: 'Fondid',
  descriptionWorkspace: 'Brändi fondid selle tööruumi kõigile lõuenditele.',
  descriptionPersonal: 'Sinu enda fondid, sinu isikliku ruumi lõuenditele.',
  descriptionRest:
    'Need ilmuvad paneeli Disain fondimenüüsse ja nendel lõuenditel kujundavatel agentidel palutakse neid kasutada. Raam, mis neist ühte kasutab, kannab fonti endaga kaasas, nii et ka kuvatõmmised ja ekspordid näitavad seda.',
  upload: 'Laadi üles',
  uploadButton: 'Laadi fondid üles',
  uploading: 'Üleslaadimine…',
  chooseFiles: 'Vali fondifailid',
  loading: 'Laadimine…',
  emptyTitle: 'Fonte veel pole',
  emptyPersonal:
    'Laadi oma fondifailid üles või lohista need sellele kaardile ja need ilmuvad sinu isiklikel lõuenditel paneeli Disain fondimenüüsse. TTF-, OTF-, WOFF- ja WOFF2-failid kuni 10 MB, üks stiil faili kohta.',
  emptyWorkspace:
    'Laadi oma brändi fondifailid üles või lohista need sellele kaardile ja kõik tööruumi liikmed näevad neid paneeli Disain fondimenüüs. TTF-, OTF-, WOFF- ja WOFF2-failid kuni 10 MB, üks stiil faili kohta.',
  fileRules: 'TTF, OTF, WOFF või WOFF2, igaüks kuni 10 MB',
  dropNotFonts: 'Siia saab lisada ainult TTF-, OTF-, WOFF- ja WOFF2-faile.',
  families: { one: '{count} perekond', other: '{count} perekonda' },
  files: { one: '{count} fail', other: '{count} faili' },
  summary: '{families}, {files}',
  preview: 'Põdur Zagrebi tšellomängija-följetonist Ciqo külmetas kehvas garaažis',
  removeFace: 'Eemalda {family} {face}',
  removeTitle: 'Kas eemaldad fondi {family} {face}?',
  removeDescription:
    'See kaob fondimenüüst ja agentidele seda enam ei pakuta. Raamid, mis seda juba kasutavad, kuvavad seda edasi.',
  removeFamily: 'Eemalda perekond',
  removeFamilyTitle: {
    one: 'Kas eemaldad fondi {family}?',
    other: 'Kas eemaldad fondi {family} ja selle {count} stiili?',
  },
  removeFamilyDescription:
    'Kõik selle stiilid kaovad fondimenüüst ja agentidele seda enam ei pakuta. Raamid, mis seda juba kasutavad, kuvavad seda edasi.',
  remove: 'Eemalda',
  loadFailed: 'Fonditeeki ei õnnestunud laadida',
  uploadFailed: 'üleslaadimine ebaõnnestus',
  tooLarge: '{name} ületab 10 MB piiri',
  removeFailed: 'Fonti ei õnnestunud eemaldada',
  addLocal: 'Lisa sellest arvutist',
  addLocalTitle: { one: 'Kas lisad fondi {name} sellesse teeki?', other: 'Kas lisad sellest arvutist {count} fonti?' },
  addLocalDescription:
    'Font jõuab kõigini, keda see teek teenindab, ja seda kasutavad raamid viivad selle kuvatõmmistesse ja eksportidesse. Operatsioonisüsteemiga kaasa tulnud või ühele arvutile ostetud fondid on sageli litsentsitud ainult sinu kasutuseks; enne siin jagamist kontrolli fondi litsentsi. Doop litsentse sinu eest ei kontrolli.',
  addLocalConfirm: 'Lisa fondid',
  localSkipped: {
    one: '{names} ei ole üksik fondifail (TTF, OTF, WOFF või WOFF2) ja jäeti välja.',
    other: '{names} ei ole üksikud fondifailid (TTF, OTF, WOFF või WOFF2) ja jäeti välja.',
  },
  localTooLarge: {
    one: '{names} ületab 10 MB piiri ja jäeti välja.',
    other: '{names} ületavad 10 MB piiri ja jäeti välja.',
  },
  localReadFailed: '{name} ei õnnestunud sellest arvutist lugeda',
}
