// Estructura: POKEMON_CHEATS[pokemon][juego] = [[nombre, codigo], ...]
// Juegos: rojo-fuego · verde-hoja · rubi · zafiro · esmeralda
// Formatos compatibles con mGBA (EmulatorJS):
//  - CodeBreaker: XXXXXXXX YYYY   (ej. 83007CEE 0097)
//  - GameShark v1/v2: XXXXXXXX YYYYYYYY
// Códigos de encuentro salvaje: activá el código y caminá por pasto hasta el combate.
const POKEMON_CHEATS = {
  "mew": {
    "rojo-fuego": [
      ["Mew salvaje (Rojo Fuego US v1.0 · CodeBreaker)", "000014D1 000A\n1003DAE6 0007\n83007CEE 0097"]
    ],
    "verde-hoja": [
      ["Mew salvaje (Verde Hoja US v1.0 · CodeBreaker)", "0000BE99 000A\n1003DAE6 0007\n83007CEE 0097"]
    ],
    "rubi": [],
    "zafiro": [],
    "esmeralda": [
      ["Mew salvaje (Esmeralda · GameShark)", "C4AAC854 8C7E0BA3\nB7ADF5B2 E13A4A70\nFB1F4204 06DCBA63\n401245E0 7D57E544"]
    ]
  }
};