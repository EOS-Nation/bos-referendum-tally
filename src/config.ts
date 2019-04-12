import { JsonRpc } from "eosjs";
import { Client } from '@elastic/elasticsearch'
import * as fetch from "isomorphic-fetch";
require('dotenv').config()

const BLOCK_INTERVAL: number = (process.env && process.env.BLOCK_INTERVAL) ? Number(process.env.BLOCK_INTERVAL) : 50;
const CHAIN = (process.env && process.env.CHAIN) ? process.env.CHAIN : "bos";
const NODEOS_ENDPOINT = (process.env && process.env.NODEOS_ENDPOINT) ? process.env.NODEOS_ENDPOINT : "https://localhost:8888";
const ELASTICSEARCH_ENDPOINT = (process.env && process.env.ELASTICSEARCH_ENDPOINT) ? process.env.ELASTICSEARCH_ENDPOINT : "http://localhost:9200";

if (!BLOCK_INTERVAL) throw new Error("[BLOCK_INTERVAL] is required as .env");
if (!CHAIN) throw new Error("[CHAIN] is required as .env");
if (!NODEOS_ENDPOINT) throw new Error("[NODEOS_ENDPOINT] is required as .env");
if (!ELASTICSEARCH_ENDPOINT) throw new Error("[ELASTICSEARCH_ENDPOINT] is required as .env");

export const rpc = new JsonRpc(NODEOS_ENDPOINT, {fetch})
export const client = new Client({ node: ELASTICSEARCH_ENDPOINT })
export {CHAIN, BLOCK_INTERVAL, NODEOS_ENDPOINT, ELASTICSEARCH_ENDPOINT}

console.log(".env configs");
console.log("BLOCK_INTERVAL:", BLOCK_INTERVAL);
console.log("CHAIN:", CHAIN);
console.log("NODEOS_ENDPOINT:", NODEOS_ENDPOINT);
console.log("ELASTICSEARCH_ENDPOINT:", ELASTICSEARCH_ENDPOINT);