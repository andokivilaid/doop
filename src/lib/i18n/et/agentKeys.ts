import type { Catalog } from '..'

export const agentKeys: Catalog['agentKeys'] = {
  loadFailed: 'Sinu võtmeid ei õnnestunud laadida',
  createFailed: 'Võtit ei õnnestunud luua',
  revokeFailed: 'Võtit ei õnnestunud tühistada',

  title: 'Agendi võtmed',
  description:
    'Bearer-tüüpi võtmed MCP otspunkti jaoks agentidele, kes ei saa sisselogimiseks brauserit avada — Mastra töövoog, n8n, CI. Võti tegutseb sinu nimel: kõik, mida see kujundab, omistatakse sulle, ja see pääseb täpselt nendele lõuenditele, kuhu pääsed sina. Tühistamine lõikab ligipääsu kohe ära.',
  newKeyRow: 'Uus võti',
  creating: 'Loon…',
  createKey: 'Loo võti',
  namePlaceholder: 'Mis seda kasutab, nt mastra-prod',
  nameAria: 'Agendi võtme nimi',

  yourNewKey: 'Sinu uus võti',
  copyNow: 'Kopeeri see kohe — seda näidatakse ainult üks kord ja salvestatakse räsitud kujul.',
  headlessConfigLabel: 'MCP seadistus liideseta kliendile',

  revokeAria: 'Tühista {name}',
  revoke: 'Tühista',
  createdLastUsed: 'loodud {created} · viimati kasutatud {used}',
  createdNeverUsed: 'loodud {created} · pole kasutatud',
  noKeysRow: 'Võtmeid veel pole',
  noKeysNote: 'Interaktiivsed kliendid (Claude Code, Codex) seda ei vaja — need logivad sisse OAuthiga.',

  revokeConfirmTitle: 'Kas tühistada „{name}“?',
  revokeConfirmDescription: 'Seda kasutavad agendid kaotavad ligipääsu kohe.',
  revokeConfirm: 'Tühista võti',
}
