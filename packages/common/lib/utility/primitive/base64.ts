/*
This file is adapted from MDN's page on Base64 encoding and decoding:
https://developer.mozilla.org/en-US/docs/Glossary/Base64#solution_2_%E2%80%93_rewriting_atob_and_btoa_using_typedarrays_and_utf-8
*/

// Array of bytes to Base64 string decoding
function b64ToUint6(nChr: number): number {
  return nChr > 64 && nChr < 91
    ? nChr - 65
    : nChr > 96 && nChr < 123
      ? nChr - 71
      : nChr > 47 && nChr < 58
        ? nChr + 4
        : nChr === 43
          ? 62
          : nChr === 47
            ? 63
            : 0;
}

export function base64StringToArray(
  sBase64: string,
  nBlocksSize?: number
): Uint8Array {
  const sB64Enc = sBase64.replaceAll(/[^\d+/A-Za-z]/g, ""); // Remove any non-base64 characters, such as trailing "=", whitespace, and more.
  const nInLen = sB64Enc.length;
  const nOutLen = nBlocksSize
    ? Math.ceil(((nInLen * 3 + 1) >> 2) / nBlocksSize) * nBlocksSize
    : (nInLen * 3 + 1) >> 2;
  const taBytes = new Uint8Array(nOutLen);

  let nMod3;
  let nMod4;
  let nUint24 = 0;
  let nOutIdx = 0;
  for (let nInIdx = 0; nInIdx < nInLen; nInIdx++) {
    nMod4 = nInIdx & 3;
    nUint24 |= b64ToUint6(sB64Enc.codePointAt(nInIdx)!) << (6 * (3 - nMod4));
    if (nMod4 === 3 || nInLen - nInIdx === 1) {
      nMod3 = 0;
      while (nMod3 < 3 && nOutIdx < nOutLen) {
        taBytes[nOutIdx] = (nUint24 >>> ((16 >>> nMod3) & 24)) & 255;
        nMod3++;
        nOutIdx++;
      }
      nUint24 = 0;
    }
  }

  return taBytes;
}

/* Base64 string to array encoding */
function uint6ToB64(nUint6: number): number {
  return nUint6 < 26
    ? nUint6 + 65
    : nUint6 < 52
      ? nUint6 + 71
      : nUint6 < 62
        ? nUint6 - 4
        : nUint6 === 62
          ? 43
          : nUint6 === 63
            ? 47
            : 65;
}

export function arrayToBase64String(aBytes: Uint8Array): string {
  let nMod3 = 2;
  let sB64Enc = "";

  const nLen = aBytes.length;
  let nUint24 = 0;
  for (let nIdx = 0; nIdx < nLen; nIdx++) {
    nMod3 = nIdx % 3;
    // To break your base64 into several 80-character lines, add:
    //   if (nIdx > 0 && ((nIdx * 4) / 3) % 76 === 0) {
    //      sB64Enc += "\r\n";
    //    }

    nUint24 |= aBytes[nIdx]! << ((16 >>> nMod3) & 24);
    if (nMod3 === 2 || aBytes.length - nIdx === 1) {
      sB64Enc += String.fromCodePoint(
        uint6ToB64((nUint24 >>> 18) & 63),
        uint6ToB64((nUint24 >>> 12) & 63),
        uint6ToB64((nUint24 >>> 6) & 63),
        uint6ToB64(nUint24 & 63)
      );
      nUint24 = 0;
    }
  }
  return (
    sB64Enc.substring(0, sB64Enc.length - 2 + nMod3) +
    (nMod3 === 2 ? "" : nMod3 === 1 ? "=" : "==")
  );
}

/* UTF-8 array to JS string and vice versa */

export function UTF8ArrToStr(aBytes: Uint8Array): string {
  let sView = "";
  let nPart: number;
  const nLen = aBytes.length;
  for (let nIdx = 0; nIdx < nLen; nIdx++) {
    nPart = aBytes[nIdx]!;
    sView += String.fromCodePoint(
      nPart > 251 && nPart < 254 && nIdx + 5 < nLen /* six bytes */
        ? /* (nPart - 252 << 30) may be not so safe in ECMAScript! So…: */
          (nPart - 252) * 1_073_741_824 +
            ((aBytes[++nIdx]! - 128) << 24) +
            ((aBytes[++nIdx]! - 128) << 18) +
            ((aBytes[++nIdx]! - 128) << 12) +
            ((aBytes[++nIdx]! - 128) << 6) +
            aBytes[++nIdx]! -
            128
        : nPart > 247 && nPart < 252 && nIdx + 4 < nLen /* five bytes */
          ? ((nPart - 248) << 24) +
            ((aBytes[++nIdx]! - 128) << 18) +
            ((aBytes[++nIdx]! - 128) << 12) +
            ((aBytes[++nIdx]! - 128) << 6) +
            aBytes[++nIdx]! -
            128
          : nPart > 239 && nPart < 248 && nIdx + 3 < nLen /* four bytes */
            ? ((nPart - 240) << 18) +
              ((aBytes[++nIdx]! - 128) << 12) +
              ((aBytes[++nIdx]! - 128) << 6) +
              aBytes[++nIdx]! -
              128
            : nPart > 223 && nPart < 240 && nIdx + 2 < nLen /* three bytes */
              ? ((nPart - 224) << 12) +
                ((aBytes[++nIdx]! - 128) << 6) +
                aBytes[++nIdx]! -
                128
              : nPart > 191 && nPart < 224 && nIdx + 1 < nLen /* two bytes */
                ? ((nPart - 192) << 6) + aBytes[++nIdx]! - 128
                : /* nPart < 127 ? */ /* one byte */
                  nPart
    );
  }
  return sView;
}

export function strToUTF8Arr(sDOMStr: string): Uint8Array {
  let nChr;
  const nStrLen = sDOMStr.length;
  let nArrLen = 0;

  /* mapping… */
  for (let nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++) {
    nChr = sDOMStr.codePointAt(nMapIdx)!;

    if (nChr >= 0x1_00_00) {
      nMapIdx++;
    }

    nArrLen +=
      nChr < 0x80
        ? 1
        : nChr < 0x8_00
          ? 2
          : nChr < 0x1_00_00
            ? 3
            : nChr < 0x20_00_00
              ? 4
              : nChr < 0x4_00_00_00
                ? 5
                : 6;
  }

  const aBytes = new Uint8Array(nArrLen);

  /* transcription… */
  let nIdx = 0;
  let nChrIdx = 0;
  while (nIdx < nArrLen) {
    nChr = sDOMStr.codePointAt(nChrIdx)!;
    if (nChr < 128) {
      /* one byte */
      aBytes[nIdx++] = nChr;
    } else if (nChr < 0x8_00) {
      /* two bytes */
      aBytes[nIdx++] = 192 + (nChr >>> 6);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else if (nChr < 0x1_00_00) {
      /* three bytes */
      aBytes[nIdx++] = 224 + (nChr >>> 12);
      aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else if (nChr < 0x20_00_00) {
      /* four bytes */
      aBytes[nIdx++] = 240 + (nChr >>> 18);
      aBytes[nIdx++] = 128 + ((nChr >>> 12) & 63);
      aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
      nChrIdx++;
    } else if (nChr < 0x4_00_00_00) {
      /* five bytes */
      aBytes[nIdx++] = 248 + (nChr >>> 24);
      aBytes[nIdx++] = 128 + ((nChr >>> 18) & 63);
      aBytes[nIdx++] = 128 + ((nChr >>> 12) & 63);
      aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
      nChrIdx++;
    } /* if (nChr <= 0x7fffffff) */ else {
      /* six bytes */
      aBytes[nIdx++] = 252 + (nChr >>> 30);
      aBytes[nIdx++] = 128 + ((nChr >>> 24) & 63);
      aBytes[nIdx++] = 128 + ((nChr >>> 18) & 63);
      aBytes[nIdx++] = 128 + ((nChr >>> 12) & 63);
      aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
      nChrIdx++;
    }
    nChrIdx++;
  }

  return aBytes;
}
