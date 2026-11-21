import type { Catalog } from '..'

export const webhooks: Catalog['webhooks'] = {
  healthOff: 'väljas — midagi ei saadeta',
  healthNoDeliveries: 'saatmisi veel pole — saada test',
  healthFailing: {
    one: '{count} järjest ebaõnnestunud · viimati {when}: {error}',
    other: '{count} järjest ebaõnnestunud · viimati {when}: {error}',
  },
  healthFailed: 'ebaõnnestus',
  healthDelivered: 'kohale toimetatud {when} (HTTP {status})',

  eventCommentCreated: 'Elemendile jäetakse kommentaar',
  eventCommentReplied: 'Kommentaarilõimes vastatakse',
  eventCommentResolved: 'Kommentaarilõim lahendatakse',
  eventFrameCreated: 'Luuakse raam',
  eventTaskCompleted: 'Agent lõpetab tahvli kaardi',
  eventTaskFailed: 'Agendil ebaõnnestub tahvli kaart',

  loadFailed: 'Sinu veebihaake ei õnnestunud laadida',
  createFailed: 'Veebihaaki ei õnnestunud luua',
  pingAnswered: 'ping vastas: HTTP {status}',
  pingFailed: 'ping ebaõnnestus: {error}',
  pingNoResponse: 'vastust pole',
  testFailed: 'Testi ei õnnestunud saata',
  toggleFailed: 'Salvestamine ebaõnnestus',
  rotateFailed: 'Saladust ei õnnestunud vahetada',
  removeFailed: 'Veebihaaki ei õnnestunud eemaldada',

  title: 'Veebihaagid',
  descriptionBefore:
    'doop saadab (POST) allolevatele URL-idele allkirjastatud JSON-sündmuse, kui midagi juhtub lõuendil, mille omanik oled, kuhu sind kutsuti või mis asub mõnes sinu tööruumis — suuna see Slacki, n8n-i, veahaldussüsteemi või mujale, kus on HTTP-otspunkt. Iga saadetis sisaldab ',
  descriptionAfter:
    ' päist (HMAC-SHA256 veebihaagi saladusega), et vastuvõtja saaks seda usaldada. Ebaõnnestunud saatmisi korratakse kolm korda; pidevalt ebaõnnestuv veebihaak peatab end ise.',
  newWebhookRow: 'Uus veebihaak',
  adding: 'Lisamine…',
  addWebhook: 'Lisa veebihaak',
  urlAria: 'Veebihaagi URL',

  signingSecretRow: 'Allkirjastamise saladus',
  copyNow: 'Kopeeri see kohe — seda näidatakse ainult korra. Kontrolli sellega saadetisi oma poolel.',
  signatureFormula:
    'signature = “sha256=” + HMAC-SHA256(secret, X-Doop-Timestamp + “.” + raw body). Dokumentatsioonis on valmis kontroll olemas.',

  sendTest: 'Saada test',
  rotateSecret: 'Vaheta saladus',
  turnOff: 'Lülita välja',
  turnOn: 'Lülita sisse',
  removeAria: 'Eemalda veebihaak hostile {host}',
  remove: 'Eemalda',
  noWebhooksRow: 'Veebihaake veel pole',
  noWebhooksNote: 'Lisa üks ülal — kiire viis proovimiseks on n8n Webhook-sõlm või request bin.',

  rotateConfirmTitle: 'Kas vahetad hosti {host} saladuse?',
  removeConfirmTitle: 'Kas eemaldad hosti {host} veebihaagi?',
  rotateConfirmDescription: 'Vana saladusega allkirjastatud saadetised ei läbi enam kontrolli.',
  removeWebhook: 'Eemalda veebihaak',
}
