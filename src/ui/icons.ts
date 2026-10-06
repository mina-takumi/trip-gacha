// 線画のアイコン。ページに一度だけ埋め込み、使う場所では <use> で呼び出す
export const ICON_DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <symbol id="i-foot" viewBox="0 0 21 30"><path d="M10.5 11c4 0 6.5 3.6 6 8.5-.5 5-2.8 9.5-6.2 9.5-3.6 0-5.5-4.5-5.8-9.3C4.2 14.8 6.6 11 10.5 11z" stroke-width="1.6"/><circle cx="4.3" cy="7.5" r="2" stroke-width="1.4"/><circle cx="8.6" cy="4.2" r="2.2" stroke-width="1.4"/><circle cx="13.4" cy="3.6" r="2.2" stroke-width="1.4"/><circle cx="17.4" cy="6.4" r="1.9" stroke-width="1.4"/></symbol>
  <symbol id="i-capsule" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M5.6 6.2A9 9 0 0 1 18.4 6.2"/></symbol>
  <symbol id="i-home" viewBox="0 0 24 24"><path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/></symbol>
  <symbol id="i-book" viewBox="0 0 24 24"><path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v14c-3-1-6-1-8 1-2-2-5-2-8-1z"/><path d="M12 6v14"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s-6-6.2-6-11a6 6 0 0 1 12 0c0 4.8-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/></symbol>
  <symbol id="i-gear" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></symbol>
  <symbol id="i-reload" viewBox="0 0 24 24"><path d="M19.5 13A7.5 7.5 0 1 1 17 6.8"/><path d="M18 3v4.5h-4.5"/></symbol>
  <symbol id="i-shard" viewBox="0 0 24 24"><path d="M12 3l6 7-6 11-6-11z"/><path d="M6 10h12"/></symbol>
  <symbol id="i-gachapon" viewBox="0 0 54 54"><circle cx="27" cy="18" r="13"/><circle cx="21" cy="15" r="3.5"/><circle cx="31" cy="21" r="3.5"/><circle cx="31" cy="12" r="2.5"/><path d="M13 30h28v18H13z"/><circle cx="27" cy="38" r="4"/><path d="M27 35v6"/><path d="M33 44h5"/></symbol>
</defs></svg>`;

export const icon = (id: string, cls = '') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
