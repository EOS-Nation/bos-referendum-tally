import { delay } from "./utils";
import { rpc, DELAY_MS, CONTRACT_FORUM } from "./config";
import { Voters, Vote, Proposal } from "./interfaces";

/**
 * Get Table `eosio::voters`
 */
export async function get_table_voters() {
    return get_tables<Voters>("eosio", "eosio", "voters", "owner", ["flags1", "reserved2", "reserved3"]);
}

/**
 * Get Table `eosio.forum::vote`
 */
export function get_table_vote() {
    return get_tables<Vote>(CONTRACT_FORUM, CONTRACT_FORUM, "vote", "id");
}

/**
 * Get Table `eosio.forum::proposal`
 */
export function get_table_proposal() {
    return get_tables<Proposal>(CONTRACT_FORUM, CONTRACT_FORUM, "proposal", "proposal_name");
}

/**
 * Get Tables
 */
export async function get_tables<T>(code: string, scope: string, table: string, lower_bound_key: string, delete_keys = []): Promise<T[]> {
    let lower_bound = "";
    const limit = 1500;
    const rows = new Map<string, T>();

    while (true) {
        console.log(`get_table_rows [${code}::${scope}:${table}] size=${rows.size} lower=${lower_bound}`);
        const response = await rpc.get_table_rows<T>(code, scope, table, {
            json: true,
            lower_bound,
            limit,
        });
        for (const row of response.rows) {
            // Delete extra fields
            for (const key of delete_keys) {
                delete row[key];
            }

            // Adding to Map removes duplicates entries
            const key = row[lower_bound_key];
            rows.set(key, row);

            // Set lower bound
            lower_bound = key;
        }
        // prevent hitting rate limits from API endpoints
        await delay(DELAY_MS);

        // end of table rows
        if (response.more === false) break;
    }
    return Array.from(rows.values());
}
