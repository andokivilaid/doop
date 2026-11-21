import type { Catalog } from '..'

export const account: Catalog['account'] = {
  nameSaveFailed: 'Nime ei õnnestunud salvestada',
  nameSaved: 'Salvestatud — agendid näevad seda minuti jooksul',
  passwordChangeFailed: 'Parooli ei õnnestunud muuta',
  passwordUpdated: 'Parool uuendatud — kõik teised seansid logiti välja',
  notifySaveFailed: 'Salvestamine ebaõnnestus — proovi uuesti',
  verificationSendFailed: 'Kirja ei õnnestunud saata',
  verificationSent: 'Kinnituskiri saadetud',
  photoSaveFailed: 'Fotot ei õnnestunud salvestada',
  photoSaved: 'Foto uuendatud',
  photoRemoved: 'Foto eemaldatud — sinu initsiaalid on tagasi',
  photoTooLarge: 'Vali foto, mis on alla 2 MB',

  profileTitle: 'Profiil',
  profileDescription:
    'Sinu nimi on identiteet, mida näidatakse kursoritel, tegevusvoos ja kõigel, mille agendile jätad. Agendid näevad muudatust minuti jooksul.',
  photoRow: 'Foto',
  photoHint: 'Näidatakse initsiaalide asemel kõikjal, kus sinu pilt kuvatakse. PNG, JPG, WebP või GIF, alla 2 MB.',
  uploadPhoto: 'Laadi foto üles',
  changePhoto: 'Muuda fotot',
  removePhoto: 'Eemalda',
  uploadingPhoto: 'Üleslaadimine…',
  choosePhotoAria: 'Vali profiilifoto',
  nameRow: 'Nimi',
  saving: 'Salvestamine…',
  displayNameAria: 'Kuvatav nimi',
  nameUnsaved: 'Muudetud — veel salvestamata',
  emailRow: 'E-post',
  emailNotChangeable: 'Sisselogimise aadress — veel muudetav ei ole',
  resendVerification: 'Saada kinnitus uuesti',
  verified: 'kinnitatud',
  unverified: 'kinnitamata',

  notificationsTitle: 'Teavitused',
  notificationsDescription:
    'E-kirjad selle kohta, mis sinu lõuenditel juhtub, kui sa neid ei vaata. Sinu enda kommentaarid neid kunagi ei käivita.',
  commentEmailsRow: 'Kommentaaride kirjad',
  commentEmailsAria: 'Saada mulle e-kiri uute kommentaaride ja vastuste kohta',
  commentEmailsLabel:
    'Uued kommentaarid ja vastused lõuenditel, mille omanik oled, kuhu sind kutsuti või kuhu oled kirjutanud — koondatuna üheks kirjaks lõuendi kohta iga paari minuti tagant.',
  emailNotConfigured: 'Selles doopis pole e-posti seadistatud (SMTP_HOST), seega ei saadeta niikuinii midagi.',

  passwordTitle: 'Parool',
  passwordDescription: 'Muutmine logib välja kõik teised brauserid ja seadmed — see jääb sisse logituks.',
  currentPassword: 'Praegune parool',
  newPassword: 'Uus parool',
  updatingPassword: 'Uuendamine…',
  updatePassword: 'Uuenda parooli',
  passwordMinLength: 'Vähemalt 8 märki',

  deleteTitle: 'Kustuta konto',
  deleteDescription: 'Kustutab sinu konto selles serveris jäädavalt. Seda ei saa tagasi võtta.',
  deleteRow: 'Kustuta konto',
  deleteHint:
    'Lõuendid, millele pääsed ligi ainult sina, kustutatakse koos kontoga; teistega jagatud või tööruumis olevad lõuendid jäävad neile.',
  deleteButton: 'Kustuta konto…',
  deleteCheckFailed: 'Sinu kontot ei õnnestunud kontrollida — proovi uuesti',
  deleteDialogTitle: 'Kas kustutad oma konto?',
  deleteDialogLede:
    'Sinu konto, sisselogimisviisid ja kõik lõuendid, millele pääsed ligi ainult sina, kustutatakse lõplikult. Lahkud oma tööruumidest ja jagatud lõuenditelt. Seda ei saa tagasi võtta.',
  deletePasswordLabel: 'Kinnitamiseks sisesta oma parool',
  deleteConfirm: 'Kustuta konto',
  deleting: 'Kustutamine…',
  deleteFailed: 'Sinu kontot ei õnnestunud kustutada',
  deleteNeedsFreshSession: 'Logi välja, logi uuesti sisse ja kustuta siis oma konto.',
}
