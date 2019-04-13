import * as path from "path";
import * as fs from "fs";
import * as write from "write-json-file";
import * as load from "load-json-file";
import { CHAIN, BLOCK_INTERVAL } from "./src/config";
import { eosioVoters, eosioVotersLastBlock } from "./src/elasticsearch";

(async () => {
    // Base filepaths
    const basepath = path.join(__dirname, "data", CHAIN, "eosio", "voters")
    const latest_filepath = path.join(basepath, "latest.json")

    // Retrieve latest block number
    let latest_block_num = 0;

    if (fs.existsSync(latest_filepath)) {
        latest_block_num = load.sync<{block_num: number}>(latest_filepath).block_num;
    }

    // lib_block_num
    const last_block_num = await eosioVotersLastBlock()

    console.log("latest_block_num:", latest_block_num);
    console.log("last_block_num:", last_block_num)

    while (true) {
        // Fetch table delta voters
        const lte = latest_block_num + 1;
        const gte = latest_block_num + 1 + BLOCK_INTERVAL;
        console.log(`request [eosio::voters] block number ${lte} <=> ${gte}`)
        let result = await eosioVoters(lte, gte);

        let max_block_num: number = null;
        console.log(`results found: ${result.length}`);
        if (result.length >= 10000) throw new Error(`more than 10000 results have been found [BLOCK_INTERVAL=${BLOCK_INTERVAL}] must be lowered`)

        if (result.length === 0) {
            write.sync(latest_filepath, {block_num: gte});
        }

        // Reverse results block lowest block num to highest
        result = result.reverse();

        // promises array allow to save files concurrently
        const promises: Promise<any>[] = []
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
            promises.push(write(voter_filepath, voter));

            // Save Latest
            promises.push(write(voter_latest_filepath, voter));
            // console.log('saving', payer, block_num)
        }
        console.log(`saving ${promises.length} files...`)
        await Promise.all(promises);
        console.log("files saved")

        // Update next latest block number as greater than value
        latest_block_num = gte;

        // End of blocks
        if (gte > last_block_num) {
            console.log(`end of block ${last_block_num}`)
            write.sync(latest_filepath, {block_num: last_block_num})
            break;
        // Save latest block number for fast restarts
        } else if (max_block_num) {
            write.sync(latest_filepath, {block_num: max_block_num})
        }
    }
})().catch(e => console.log(e));
