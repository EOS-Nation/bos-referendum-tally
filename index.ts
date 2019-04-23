import * as path from "path";
import * as write from "write-json-file";
import { CronJob } from "cron";
import { Vote, Proposal, Voters, Delband } from "./src/interfaces";
import { rpc, CHAIN, CONTRACT_FORUM } from "./src/config";
import { filterVotersByVotes } from "./src/tallies";
import { get_table_voters, get_table_vote, get_table_proposal } from "./src/get_tables";
import { disjoint } from "./src/utils";

// Base filepaths
const basepath = path.join(__dirname, "data", CHAIN);

// Global containers
let votes: Vote[] = [];
let voters: Voters[] = [];
let proposals: Proposal[] = [];
let votes_owner: Set<string> = new Set();
let voters_owner: Set<string> = new Set();
let delband: Delband[] = [];

/**
 * Sync `eosio` tables
 */
async function syncEosio() {
    const {head_block_num} = await rpc.get_info()
    console.log("head_block_num:", head_block_num)

    // fetch `eosio` voters
    voters = filterVotersByVotes(await get_table_voters(), votes);
    voters_owner = new Set(voters.map((row) => row.owner));

    // Retrieve `staked` from accounts that have not yet voted for BPs
    const owners_without_stake = disjoint(votes_owner, voters_owner)
    console.log(owners_without_stake, owners_without_stake.size);
    // delband = await get_table_delband(votes_owner, voters_owner);

    // Save JSON
    save(path.join(basepath, "eosio", "voters"), head_block_num, voters);
}

/**
 * Sync `eosio.forum` tables
 */
async function syncForum() {
    const {head_block_num} = await rpc.get_info()
    console.log("head_block_num:", head_block_num)

    // fetch `eosio.forum` votes
    votes = await get_table_vote();
    votes_owner = new Set(votes.map((row) => row.voter));

    // fetch `eosio.forum` proposal
    proposals = await get_table_proposal();

    // Save JSON
    save(path.join(basepath, CONTRACT_FORUM, "vote"), head_block_num, votes);
    save(path.join(basepath, CONTRACT_FORUM, "proposal"), head_block_num, proposals);
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

