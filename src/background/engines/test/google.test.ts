import {expect, it} from 'vitest'

import type {AxiosError} from "axios";
import {translate} from "@/background/engines/google/browserV2";
import {translate as translateV1} from "@/background/engines/google/browserV1";
import {axiosInstance} from "@/utils";

// function sum(a: number, b: number) {
//     console.log(a)
//     return a + b;
// }


it('translate: google: apiBrowser', async () => {
    axiosInstance.defaults.proxy = {host: "localhost", port: 7890, protocol: "http"}
    expect(await translate(["test"], "auto", "").then((result: string[]) => {
            console.log("result: ", result)
            return 0;
        }).catch((err: AxiosError) => {
            console.error(err?.response?.data);
            return -1;
        })
    ).toBe(0);
    // expect(sum(1, 2)).toBe(3)

});


it('translate: 360: apiBrowser', async () => {
    expect(
        await translateV1(
            ["Photo shows a hot air balloon in Wanjiang town, Ningyuan county of central China&#39;s Hunan Province." +
            " The county actively leverages the natural ecological landscape and uniquely advantageous airspace" +
            " conditions to introduce hot air balloon projects, aiming to create an internationally competitive hot air balloon flight base. (Photo/Cai Xiaoping)",
                "test",
            ],

            "auto", "").then((result: string[]) => {return result})
    ).toBe(10)
})