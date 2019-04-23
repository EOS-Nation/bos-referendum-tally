import * as fs from "fs";
import * as path from "path";
import * as write from "write-json-file";
import * as load from "load-json-file";
import { CronJob } from "cron";
import { Vote, Proposal, Voters, Delband } from "./src/interfaces";
import { rpc, CHAIN, CONTRACT_FORUM, DEBUG } from "./src/config";
import { filterVotersByVotes, generateAccounts, generateProxies, generateTallies } from "./src/tallies";
import { get_table_voters, get_table_vote, get_table_proposal, get_table_delband, get_currency_supply } from "./src/get_tables";
import { disjoint } from "./src/utils";

// Base filepaths
const basepath = path.join(__dirname, "data", CHAIN);
const voters_latest = path.join(basepath, "eosio", "voters", "latest.json")
const delband_latest = path.join(basepath, "eosio", "delband", "latest.json")
const vote_latest = path.join(basepath, CONTRACT_FORUM, "vote", "latest.json")
const proposal_latest = path.join(basepath, CONTRACT_FORUM, "proposal", "latest.json")

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
async function syncEosio(head_block_num: number) {
    console.log(`syncEosio [head_block_num=${head_block_num}]`)

    // fetch `eosio` voters
    if (DEBUG && fs.existsSync(voters_latest)) voters = load.sync(voters_latest) // Speed up process for debugging
    else voters = filterVotersByVotes(await get_table_voters(), votes);
    voters_owner = new Set(voters.map((row) => row.owner));

    // Retrieve `staked` from accounts that have not yet voted for BPs
    const owners_without_stake = disjoint(votes_owner, voters_owner)
    if (DEBUG && fs.existsSync(delband_latest)) delband = load.sync(delband_latest) // Speed up process for debugging
    else delband = await get_table_delband(owners_without_stake);

    // Save JSON
    save(path.join(basepath, "eosio", "voters"), head_block_num, voters);
    save(path.join(basepath, "eosio", "delband"), head_block_num, delband);
}

/**
 * Sync `eosio.forum` tables
 */
async function syncForum(head_block_num: number) {
    console.log(`calculateTallies [head_block_num=${head_block_num}]`);

    // fetch `eosio.forum` votes
    if (DEBUG && fs.existsSync(vote_latest)) votes = load.sync(vote_latest) // Speed up process for debugging
    else votes = await get_table_vote();
    votes_owner = new Set(votes.map((row) => row.voter));

    // fetch `eosio.forum` proposal
    if (DEBUG && fs.existsSync(proposal_latest)) proposals = load.sync(proposal_latest) // Speed up process for debugging
    else proposals = await get_table_proposal();

    // Save JSON
    save(path.join(basepath, CONTRACT_FORUM, "vote"), head_block_num, votes);
    save(path.join(basepath, CONTRACT_FORUM, "proposal"), head_block_num, proposals);
}

/**
 * Calculate Tallies
 */
async function calculateTallies(head_block_num: number) {
    console.log(`calculateTallies [head_block_num=${head_block_num}]`);

    const accounts = generateAccounts(votes, delband, voters);
    const proxies = generateProxies(votes, delband, voters);
    const currency_supply = await get_currency_supply();
    const tallies = generateTallies(head_block_num, proposals, accounts, proxies, currency_supply);

    // Save JSON
    save(path.join(basepath, "referendum", "accounts"), head_block_num, accounts);
    save(path.join(basepath, "referendum", "proxies"), head_block_num, proxies);
    save(path.join(basepath, "referendum", "tallies"), head_block_num, tallies);
}


/**
 * Save JSON file
 */
function save(basepath: string, block_num: number, json: any) {
    const filepath = path.join(basepath, block_num + ".json");
    console.log(`saving JSON ${filepath}`);
    write.sync(filepath, json);
    write.sync(path.join(basepath, "latest.json"), json);
}

/**
 * BOS Referendum Vote Tally
 */
async function main() {
    // First initialize
    const {head_block_num} = await rpc.get_info()
    await syncForum(head_block_num);
    await syncEosio(head_block_num);
    await calculateTallies(head_block_num);

    // Quick tasks
    new CronJob("*/5 * * * *", async () => {
        const {head_block_num} = await rpc.get_info()
        await syncForum(head_block_num);
        await calculateTallies(head_block_num);

    }, () => {}, true, "America/Toronto");

    // Tasks that take a long time to process
    new CronJob("*/30 * * * *", async () => {
        const {head_block_num} = await rpc.get_info()
        await syncEosio(head_block_num)

    }, () => {}, true, "America/Toronto");
}
main();

