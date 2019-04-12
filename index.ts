import * as path from "path";
import * as fs from "fs";
import * as write from "write-json-file";
import * as load from "load-json-file";
import { rpc, CHAIN, BLOCK_INTERVAL } from "./src/config";
import { eosioVoters } from "./src/elasticsearch";

(async () => {
    // Base filepaths
    const basepath = path.join(__dirname, "data", CHAIN, "eosio", "voters")
    const latest_filepath = path.join(basepath, "latest.json")

    // Retrieve latest block number
    let latest_block_num = 0;

    if (fs.existsSync(latest_filepath)) {
        latest_block_num = load.sync<{block_num: number}>(latest_filepath).block_num;
    }

    console.log("latest_block_num:", latest_block_num);

    while (true) {
        // Fetch table delta voters
        const lte = latest_block_num + 1;
        const gte = latest_block_num + 1 + BLOCK_INTERVAL;
        console.log(`request [eosio::voters] block number ${lte} <=> ${gte}`)
        let result = await eosioVoters(lte, gte);

        let max_block_num: number = null;
        console.log(`results found: ${result.length}`);
        if (result.length >= 10000) throw new Error(`more than 10000 results have been found [BLOCK_INTERVAL=${BLOCK_INTERVAL}] must be lowered`)

        if (result.length === 0) write.sync(latest_filepath, {block_num: gte})

        // Reverse results block lowest block num to highest
        result = result.reverse()

        for (const voter of result) {
            const {block_num, payer} = voter;

            // Voter filepaths
            const voter_filepath = path.join(basepath, payer, `${String(block_num)}.json`)
            const voter_latest_filepath = path.join(basepath, payer, `latest.json`);

            // Update max block number
            if (max_block_num === null || block_num > max_block_num) max_block_num = block_num;

            // Skip if already exists
            if (fs.existsSync(voter_filepath)) continue;

            // Save Block Number
            write.sync(voter_filepath, voter)

            // Save Latest
            write.sync(voter_latest_filepath, voter);
            // console.log('saving', payer, block_num)
        }
        latest_block_num = gte;
        if (max_block_num) write.sync(latest_filepath, {block_num: max_block_num})

        // if (latest_block_num > 5000) break;
    }
})().catch(e => console.log(e.meta.body.error));
