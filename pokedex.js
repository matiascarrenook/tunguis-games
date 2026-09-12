const PUNTOS = {
  mew: 1000, mewtwo: 1000, rayquaza: 980, groudon: 950, kyogre: 950,
  lugia: 960, hooh: 960, celebi: 940, jirachi: 940, deoxys: 940,
  latios: 700, latias: 700,
  dragonite: 520, tyranitar: 520, salamence: 520, metagross: 520,
  charizard: 320, blastoise: 320, venusaur: 320, gengar: 260,
  alakazam: 260, gyarados: 260, arcanine: 260, snorlax: 260
};

function puntosDe(specie) {
  var k = (specie || "").trim().toLowerCase();
  return PUNTOS.hasOwnProperty(k) ? PUNTOS[k] : 100;
}

function rarezaDe(specie) {
  var pts = puntosDe(specie);
  if (pts >= 900) return "Legendario";
  if (pts >= 500) return "Épico";
  if (pts >= 250) return "Raro";
  return "Común";
}

function listaColeccion() {
  try { return JSON.parse(localStorage.getItem("tunguis_coleccion") || "[]"); } catch (e) { return []; }
}

function agregarPokemon(specie, juego) {
  try {
    var arr = listaColeccion();
    arr.push({ s: specie, g: juego, f: Date.now() });
    localStorage.setItem("tunguis_coleccion", JSON.stringify(arr.slice(-2000)));
    return true;
  } catch (e) { return false; }
}

var B32 = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function aBase32(bytes) {
  var bits = 0, val = 0, out = "";
  for (var i = 0; i < bytes.length; i++) {
    val = (val << 8) | bytes[i];
    bits += 8;
    while (bits >= 5) { out += B32[(val >> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits > 0) out += B32[(val << (5 - bits)) & 31];
  return out;
}

function base32AByte(s) {
  var bits = 0, val = 0, out = [];
  for (var i = 0; i < s.length; i++) {
    var idx = B32.indexOf(s.charAt(i));
    if (idx < 0) return null;
    val = (val << 5) | idx;
    bits += 5;
    while (bits >= 8) { bits -= 8; out.push((val >> bits) & 255); }
  }
  return Uint8Array.from(out);
}

var RND_HEX = "0123456789abcdef";

function generarCarton(specie) {
  var uid = "";
  for (var i = 0; i < 8; i++) uid += RND_HEX[Math.floor(Math.random() * 16)];
  var bytes = specie.trim().toLowerCase().split("").map(function (c) { return c.charCodeAt(0); });
  var suma = 0;
  for (var j = 0; j < bytes.length; j++) suma = (suma + bytes[j]) % 100000;
  var payload = JSON.stringify({ v: 1, s: specie.trim().toLowerCase(), u: uid, c: suma });
  var codigo = aBase32(new TextEncoder().encode(payload));
  var partes = [];
  for (var k = 0; k < codigo.length; k += 4) partes.push(codigo.slice(k, k + 4));
  return { codigo: partes.join("-"), u: uid };
}

function validarCarton(codigo) {
  var limpio = (codigo || "").replace(/[^A-Za-z2-9]/g, "").toUpperCase();
  if (limpio.length < 12) return null;
  var bytes = base32AByte(limpio);
  if (!bytes) return null;
  var texto;
  try { texto = new TextDecoder().decode(bytes); } catch (e) { return null; }
  var obj;
  try { obj = JSON.parse(texto); } catch (e) { return null; }
  if (!obj || obj.v !== 1 || typeof obj.s !== "string") return null;
  var suma = 0;
  var b = obj.s.trim().toLowerCase().split("").map(function (c) { return c.charCodeAt(0); });
  for (var i = 0; i < b.length; i++) suma = (suma + b[i]) % 100000;
  if (obj.c !== suma) return null;
  return { s: obj.s, u: obj.u };
}

function tieneCodigos(specie) {
  return !!(window.POKEMON_CHEATS && window.POKEMON_CHEATS[specie.trim().toLowerCase()]);
}