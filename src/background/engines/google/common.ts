

//https://translate.google.com/translate_a/element.js?cb=gtElInit&hl=zh-CN&client=wt
export const getTk = function (texts: string | string[], tkk: string): string {
    let a: string = ""
    if (Array.isArray(texts)) {
        a = JSON.parse(JSON.stringify(texts)).join('')
    } else {
        a = texts
    }
    const d = tkk.split(".");
    const b = Number(d[0]);
    const e = []
    for (let f = 0, g = 0; g < a.length; g++) {
        let h = a.charCodeAt(g);
        h < 128 ? e[f++] = h :
            (h < 2048 ? e[f++] = h >> 6 | 192 :
                // eslint-disable-next-line eqeqeq
                ((h & 64512) == 55296 && g + 1 < a.length && (a.charCodeAt(g + 1) & 64512) == 56320 ? (h = 65536 + ((h & 1023) << 10) + (a.charCodeAt(++g) & 1023), e[f++] = h >> 18 | 240, e[f++] = h >> 12 & 63 | 128) :
                    e[f++] = h >> 12 | 224, e[f++] = h >> 6 & 63 | 128), e[f++] = h & 63 | 128)
    }
    a = b;
    for (let f = 0; f < e.length; f++) {
        a += e[f];
        a = nu(a, "+-a^+6");
    }

    a = nu(a, "+-3^+b+-f");
    a ^= Number(d[1]) || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a %= 1E6;
    return (a.toString() + "." + (a ^ b))
}


const nu = (a: string, b: string): string => {
        let c = 0;
        let d: string | number = "";
        for (c = 0; c < b.length - 2; c += 3) {
            d = b.charAt(c + 2);
            d = d >= "a" ? d.charCodeAt(0) - 87 : Number(d);
            d = b.charAt(c + 1) === "+" ? a >>> d : a << d;
            a = b.charAt(c) === "+" ? a + d & 4294967295 : a ^ d
        }
        return a
    };

