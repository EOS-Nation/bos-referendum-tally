import { Voters } from "./interfaces";
import { client, CHAIN } from "./config";

/**
 * Fetch `eosio::voters`
 *
 * @param {number} gte Greater and equal than block number
 * @param {number} lte Lower and equal than block number
 * @param {object} [options={}] optional params
 * @param {string} [options.chain="eos"] EOSIO Chain
 * @param {number} [options.chain=10000] maximum result from Elasticsearch aggregation
 * @example
 *
 * const voters = await eosioVoters(0, 500);
 * //= [{ block_num: 497, '@voters': {...}]
 */
export async function eosioVoters(gte: number, lte: number, options: {
    chain?: string,
    size?: number,
} = {}) {
    const chain = options.chain || CHAIN;
    const size = options.size || 10000;

    const search = await client.search({
        index: `${chain}-delta`,
        size: 0,
        body: {
            query: {
                bool: {
                    must: [
                        { range: { block_num: {gte, lte } }},
                        { match: { table: "voters" } },
                        { multi_match: { query: "eosio", fields: ["code", "scope"] } }
                    ]
                }
            },
            aggs: {
                payers: {
                    terms: {
                        field: "payer",
                        size,
                    },
                    aggs: {
                        results: {
                            top_hits: {
                                sort: [ { block_num: { order: "desc" } } ],
                                // sort: [ { primary_key: { order: "desc" } } ],
                                _source: { includes: [ "payer", "primary_key", "block_num", "@voters"] },
                                size : 1
                            },
                        },
                    },
                },
            }
        }
    });
    if (search.statusCode !== 200) throw new Error("statusCode must be 200");

    const hits: Voters[] = []
    for (const bucket of search.body.aggregations.payers.buckets) {
        for (const hit of bucket.results.hits.hits) {
            hits.push(hit._source);
        }
    }
    return hits;
}

export async function eosioVotersLastBlock(options: {
    chain?: string,
} = {}) {
    const chain = options.chain || CHAIN;

    const search = await client.search({
        index: `${chain}-delta`,
        size: 0,
        body: {
            query: {
                bool: {
                    must: [
                        { match: { table: "voters" } },
                        { multi_match: { query: "eosio", fields: ["code", "scope"] } }
                    ]
                }
            },
            aggs: {
                block_num : { "max" : { field : "block_num" } }
            }
        }
    });
    if (search.statusCode !== 200) throw new Error("statusCode must be 200");

    return search.body.aggregations.block_num.value;
}

// (async () => {
//     console.log(await eosioVotersLatestBlock())
// })();