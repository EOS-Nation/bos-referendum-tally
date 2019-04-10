import * as fs from "fs";
import { hyperion, rpc, client } from "./src/config";

(async () => {
    // const deltas = await hyperion.get_deltas("eosio.forum", "eosio.forum", "vote", "deniscarrier");
    // console.log(deltas);
    // const deltas = await hyperion.get_deltas("eosio", "eosio", "voters", "deniscarrier");
    // console.log(deltas.deltas[0]['@voters']);
    // rpc.get_table_rows()

    // promise API
    const result = await client.search({
        index: 'bos-delta',
        q: `code:eosio and table:voters and block_num >=500000 and block_num <= 500500`,
        size: 10000
    });
    // for (const hit of result.body.hits.hits) {
    //     console.log(hit);
    // }
    // fs.writeFileSync("result.json", JSON.stringify(result, null, 4));
    console.log(result.body.hits.hits.length)

})().catch(e => console.log(e.meta.body.error));
