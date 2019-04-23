// import { JsonRpc } from "eosjs";
import { DappClient as JsonRpc } from "dapp-client";
import * as fetch from "isomorphic-fetch";
require('dotenv').config()

if (!process.env.NODEOS_ENDPOINT) throw new Error("[NODEOS_ENDPOINT] is required as .env");
if (!process.env.CHAIN_ID) throw new Error("[CHAIN_ID] is required as .env");

// Required
export const NODEOS_ENDPOINT = process.env.NODEOS_ENDPOINT;
export const CHAIN_ID = process.env.CHAIN_ID;

// Optional
export const CONTRACT_FORUM = process.env.CONTRACT_FORUM || "bosforumdapp";
export const CONTRACT_TOKEN = process.env.CONTRACT_TOKEN || "eosio.token";
export const TOKEN_SYMBOL = process.env.TOKEN_SYMBOL || "BOS";

// Debug Configs
export const DELAY_MS = Number(process.env.DELAY_MS || 10);
export const DEBUG: boolean = JSON.parse(process.env.DEBUG || "false");

// eosio RPC
export const rpc = new JsonRpc(NODEOS_ENDPOINT, {fetch})

console.log("Configurations");
console.log("--------------");
console.log("NODEOS_ENDPOINT:", NODEOS_ENDPOINT);
console.log("CHAIN_ID:", CHAIN_ID);
console.log("DELAY_MS:", DELAY_MS);
console.log("CONTRACT_FORUM:", CONTRACT_FORUM);
console.log("CONTRACT_TOKEN:", CONTRACT_TOKEN);
console.log("TOKEN_SYMBOL:", TOKEN_SYMBOL);
console.log("DEBUG:", DEBUG);
