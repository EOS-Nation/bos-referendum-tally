import * as path from "path";
import * as fs from "fs";
import * as write from "write-json-file";
import * as load from "load-json-file";
import { CronJob } from "cron";
import { Vote, Proposal, Voters } from "./src/interfaces";
import { rpc, CHAIN, CONTRACT_FORUM } from "./src/config";
import { get_table_voters, get_table_vote, get_table_proposal } from "./src/get_tables";

// Base filepaths
const basepath = path.join(__dirname, "data", CHAIN);

// Global containers
let vote: Vote[] = [];
let voters: Voters[] = [];
let proposal: Proposal[] = [];

/**
 * Sync `eosio` tables
 */
async function syncEosio() {
    console.log("vote", vote.length)
    const {head_block_num} = await rpc.get_info()
    console.log("head_block_num:", head_block_num)

    voters = await get_table_voters();
    save(path.join(basepath, "eosio", "voters"), head_block_num, voters);
}

/**
 * Sync `eosio.forum` tables
 */
async function syncForum() {
    const {head_block_num} = await rpc.get_info()
    console.log("head_block_num:", head_block_num)

    vote = await get_table_vote();
    save(path.join(basepath, CONTRACT_FORUM, "vote"), head_block_num, vote);

    proposal = await get_table_proposal();
    save(path.join(basepath, CONTRACT_FORUM, "proposal"), head_block_num, proposal);
}

/**
 * Save JSON file
 */
function save(basepath: string, block_num: number, json: any) {
    write.sync(path.join(basepath, block_num + ".json"), json);
    write.sync(path.join(basepath, "latest.json"), json);
}

/**
 * Main CronJobs
 */
async function main() {
    await syncForum();
    await syncEosio();

    new CronJob("*/5 * * * *", async () => {
        await syncForum()
    }, () => {}, true, "America/Toronto");

    new CronJob("*/30 * * * *", async () => {
        await syncEosio()
    }, () => {}, true, "America/Toronto");
}
main();

