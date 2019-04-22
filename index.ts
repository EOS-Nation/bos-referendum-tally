import * as path from "path";
import * as fs from "fs";
import * as write from "write-json-file";
import * as load from "load-json-file";
import { rpc, CHAIN, CONTRACT_FORUM } from "./src/config";
import { get_table_voters, get_table_vote} from "./src/get_tables";

async function main() {
    // Base filepaths
    const basepath = path.join(__dirname, "data", CHAIN)

    const {head_block_num} = await rpc.get_info()
    console.log("head_block_num:", head_block_num)

    const vote = await get_table_vote();
    save(path.join(basepath, CONTRACT_FORUM, "vote"), head_block_num, vote);

    const voters = await get_table_voters();
    save(path.join(basepath, "eosio", "voters"), head_block_num, voters);
}

function save(basepath: string, block_num: number, json: any) {
    write.sync(path.join(basepath, block_num + ".json"), json);
    write.sync(path.join(basepath, "latest.json"), json);
}

main().catch(e => console.error(e.message));
