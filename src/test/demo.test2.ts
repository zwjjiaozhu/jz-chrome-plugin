
const {
    translate,
} = require('../background/engines/google/browserV2')


test('translate: google: apiBrowser', () => {
    expect(translate(["test"], "auto", "").then((result: string[]) => {
        console.log("result: ", result)
    })).toBe(3);

});