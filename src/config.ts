import { JsonRpc as HyperionRpc } from "@eoscafe/hyperion";
import { JsonRpc } from "eosjs";
import { Client } from '@elastic/elasticsearch'
import * as fetch from "isomorphic-fetch";


const HYPERION_ENDPOINT = (process.env && process.env.HYPERION_ENDPOINT) ? process.env.HYPERION_ENDPOINT : "https://eos.hyperion.eosrio.io";
const NODEOS_ENDPOINT = (process.env && process.env.NODEOS_ENDPOINT) ? process.env.NODEOS_ENDPOINT : "https://api.eosn.io";
const ELASTICSEARCH_ENDPOINT = (process.env && process.env.ELASTICSEARCH_ENDPOINT) ? process.env.ELASTICSEARCH_ENDPOINT : "http://localhost:9200";

if (!HYPERION_ENDPOINT) throw new Error("[HYPERION_ENDPOINT] is required as .env");
if (!NODEOS_ENDPOINT) throw new Error("[NODEOS_ENDPOINT] is required as .env");
if (!ELASTICSEARCH_ENDPOINT) throw new Error("[ELASTICSEARCH_ENDPOINT] is required as .env");

export const hyperion = new HyperionRpc(HYPERION_ENDPOINT, {fetch})
export const rpc = new JsonRpc(NODEOS_ENDPOINT, {fetch})
export const client = new Client({ node: ELASTICSEARCH_ENDPOINT })
