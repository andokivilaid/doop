import type { Catalog } from '..'

export const connect: Catalog['connect'] = {
  blurbClaudeCode: 'Ühenda terminalist',
  blurbClaude: 'Lisa Doop Claude’i',
  blurbChatgpt: 'Ühenda brauseris',
  blurbCodex: 'ChatGPT töölauarakendus ja Codex CLI',
  blurbCursor: 'Lisa Doop Cursorisse',
  otherClientName: 'Muu MCP-klient',
  headlessName: 'Liideseta agent või server',
  blurbHeadless: 'n8n, Mastra, CI ja skriptid, agendivõtmega',
  blurbOtherClient: 'Kasuta käsitsi ühendust',

  chooseTitle: 'Vali oma agent',
  chooseLede:
    'Lase agendil, mida juba kasutad, MCP kaudu sellel lõuendil töötada. Vali oma agent, et näha ühendamise juhiseid.',

  pointAtTitle: 'Suuna see sellele lõuendile',
  pointAtWithPrompt: 'Kleebi see oma esimeseks sõnumiks. Kõik muu, mida agent vajab, tuleb serverist.',
  pointAtNoPrompt: 'Ava lõuend ja ütle agendile, et ta sellega tegeleks. Kõik muu, mida ta vajab, tuleb serverist.',
  approveSignInTitle: 'Kinnita sisselogimine',

  claudeCodeLede: 'Kolm sammu, umbes minut. Seejärel kujundab Claude Code sellel lõuendil sinu nimel.',
  claudeCodeAddTitle: 'Lisa Doop MCP-serverina',
  claudeCodeAddBefore: 'Käivita see üks kord suvalises terminalis. See registreerib ',
  claudeCodeAddAfter: ' serveri kõigi projektide jaoks.',
  claudeCodeSignInTitle: 'Logi sisse Claude Code’ist',
  claudeCodeSignInBefore: 'Kirjuta Claude Code’is ',
  claudeCodeSignInPick: ', vali ',
  claudeCodeSignInThen: ', seejärel ',
  claudeCodeSignInAfter: '. Avaneb brauseri vahekaart, kus saad ühenduse kinnitada.',

  claudeDesktopLede: 'Lisa Doop töölauarakendusest, kinnita Claude’is ja hakake koos kujundama.',
  claudeDesktopAddTitle: 'Lisa Doop Claude Desktopi',
  claudeDesktopAddBody:
    'Klõpsa Doopi töölauarakenduses Lisa Claude’i ja kinnita seejärel paigaldus Claude’is. Sinu Doopi serveri aadress täidetakse automaatselt.',
  claudeDesktopConnectTitle: 'Ühenda oma Doopi konto',
  claudeDesktopConnectBody: 'Lülita laiendus Claude’is sisse. Logi avanevas brauseris Doopi sisse ja kinnita ühendus.',
  claudeDesktopPointWithPrompt:
    'Alusta Claude’is uut vestlust, lülita tööriistade menüüs Doop sisse ja saada see oma esimese sõnumina.',
  claudeDesktopPointNoPrompt:
    'Alusta Claude’is uut vestlust, lülita tööriistade menüüs Doop sisse ja ütle, millise lõuendiga tegeleda.',

  claudePublicLede: 'Claude’i veebikonnektor vajab avalikult kättesaadavat HTTPS-serverit.',
  claudeLocalTitle: 'Kasuta selle serveri jaoks töölauaühendust',
  claudeLocalBody:
    'See Doopi aadress on kohalik või kasutab HTTP-d. Vali ülal Töölauarakendus, et ühendada oma arvutist, või ava Doop selle avalikul HTTPS-aadressil.',

  claudeWebLede: 'Lisa Doop oma Claude’i kontole, kinnita ühendus ja hakka kujundama. Midagi pole vaja alla laadida.',
  claudeWebAddTitle: 'Lisa Doop Claude’i',
  claudeWebAddBody:
    'Ava Claude, kus Doopi nimi ja serveri aadress on juba täidetud. Vaata andmed üle ja lisa konnektor.',
  addToClaude: 'Lisa Claude’i',
  claudeWebApproveBody: 'Klõpsa uuel konnektoril Connect. Avaneb brauseri vahekaart, kus saad ühenduse kinnitada.',
  claudeWebPointWithPrompt: 'Lülita uues vestluses tööriistade menüüs Doop sisse ja saada see oma esimese sõnumina.',
  claudeWebPointNoPrompt: 'Lülita uues vestluses tööriistade menüüs Doop sisse ja ütle, millise lõuendiga tegeleda.',

  chatgptPublicLede: 'ChatGPT vajab selle Doopi serverini jõudmiseks avalikku HTTPS-aadressi või turvalist tunnelit.',
  chatgptReachTitle: 'Tee oma Doopi server kättesaadavaks',
  chatgptReachBody:
    'ChatGPT ei jõua selle aadressini otse. Ava oma avalik HTTPS-iga Doopi aadress ja alusta ühendamist seal või seadista selle serveri jaoks OpenAI Secure MCP Tunnel.',
  chatgptGuide: 'Vaata ChatGPT seadistusjuhendit',

  chatgptLede: 'Midagi pole vaja alla laadida. Ava ChatGPT, kleebi allolev serveri aadress ja kinnita Doopi ühendus.',
  chatgptOpenTitle: 'Ava ChatGPT pistikprogrammid',
  chatgptOpenBefore: 'Klõpsa lehel Plugins nuppu ',
  chatgptOpenMiddle: ', seejärel ',
  chatgptOpenAfter: '. Sinu konto või tööruum peab lubama kohandatud servereid.',
  chatgptOpenButton: 'Ava ChatGPT seadistus',
  chatgptAddTitle: 'Lisa Doop ja logi sisse',
  chatgptAddBefore: 'Pane nimeks ',
  chatgptAddDescribe: ', kirjelda seda kui kujunduslõuendit ja kleebi see MCP-serveri URL-iks. Vali ',
  chatgptAddReview: ', vaata õigused üle ja vali seejärel ',
  chatgptAddAfter: '. Logi küsimisel Doopi sisse ja paigalda loodud pistikprogramm.',
  chatgptPointWithPrompt: 'Alusta uut vestlust, kirjuta @ ja vali Doop, seejärel saada see oma esimese sõnumina.',
  chatgptPointNoPrompt: 'Alusta uut vestlust, kirjuta @ ja vali Doop, seejärel ütle, millise lõuendiga tegeleda.',

  codexLede: 'Lisa Doop töölauarakendusest, logi sisse ja hakka Codexiga kujundama.',
  codexAddTitle: 'Lisa Doop Codexisse',
  codexAddBody:
    'Doop Desktop seadistab Codexi sinu eest. See töötab Codex CLI-ga ja ChatGPT töölauarakenduse Codexi vahekaardiga.',
  codexSignInTitle: 'Logi sisse Codexist',
  codexSignInBody:
    'Ava uus Codexi vestlus. Kui Doop vajab autentimist, logi sisse selle MCP-seadetest. Codex CLI puhul käivita allolev käsk ja kinnita ühendus brauseris.',

  cursorLede: 'Lisa Doop Cursorisse, logi sisse ja hakake koos kujundama.',
  cursorAddTitle: 'Lisa Doop Cursorisse',
  cursorAddBody: 'Ava Cursor ja vaata serveriühendus üle. Faili pole vaja alla laadida.',
  cursorApproveBody:
    'Lülita Cursoris doopi server sisse ja vii lõpuni sisselogimine brauseris. Seejärel saab sinu agent töötada lõuenditel, millele sul on ligipääs.',
  cursorPointWithPrompt: 'Ava Agendi vestlus ja saada see oma esimese sõnumina.',
  cursorPointNoPrompt: 'Ava Agendi vestlus ja ütle, millise lõuendiga tegeleda.',

  mcpLede: 'Doop on OAuthiga streamable-HTTP MCP-server. Siin saab kujundada iga klient, mis seda toetab.',
  mcpConfigTitle: 'Lisa see server oma kliendi MCP-konfiguratsiooni',
  mcpConfigBefore: 'Windsurf, Zed, Cline ja VS Code loevad kõik sellist JSON-faili. Kleebi sinna ',
  mcpConfigAfter: ' kirje.',
  mcpApproveBody:
    'Kui klient esimest korda ühendub, avaneb selle autoriseerimiseks brauseri vahekaart. Seejärel töötab agent sinu nimel ja tema muudatused omistatakse sulle.',

  connectAgentTitle: 'Ühenda {name}',
  claudeMethodAria: 'Claude’i ühendamise viis',
  desktopApp: 'Töölauarakendus',
  connectOnline: 'Ühenda veebis',
  connectionHelp: 'Abi ühendamisel',
  helpBefore:
    'Kui Claude palub sul esmalt sisse logida, tule siia tagasi ja klõpsa uuesti Lisa Claude’i. Võid ka kasutada ',
  helpAfter: ' Claude’is selle aadressiga:',
  mcpMethodAria: 'Kuidas klient sisse logib',
  mcpBrowser: 'Logi sisse brauseriga',
  mcpAgentKey: 'Agendivõti (liideseta)',
  agentKeyLede:
    'Agentidele, mis töötavad ilma, et keegi brauseri taga oleks. Võti tegutseb sinu nimel lõuenditel, millele sul on ligipääs.',
  agentKeyCreateTitle: 'Loo agendivõti',
  agentKeyCreateBody:
    'Nimeta see agendi järgi, kes seda kasutama hakkab. Kopeeri võti, kui see ilmub: seda näidatakse ainult korra ja saad selle seal igal ajal tühistada.',
  agentKeyOpen: 'Ava Seaded → Agendivõtmed',
  agentKeySendTitle: 'Saada see iga päringuga',
  agentKeySendBody:
    'Lisa server, kasutades oma võtit bearer-päisena, asendades sellega dpk_…. n8n MCP Client sõlm, Mastra MCPClient ja enamik MCP SDK-sid võtavad päiseid sellisel kujul.',
  done: 'Valmis',

  arrived: '{name} on siin — toimis',
  listening: 'ootan agenti {name}…',
  yourAgent: 'sinu agent',

  codexSetupTitle: 'Ava vastav Doopi server',
  codexSetupBody:
    'See seadistuslink on mõeldud teisele Doopi serverile või on puudulik. Ava selle serveri töölauarakenduses Connect AI või kasuta brauseris Codexi käsitsi seadistust.',
  backToDoop: 'Tagasi Doopi',
}
