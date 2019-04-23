# BOS Referendum Tally

## Install

```bash
git clone https://github.com/EOS-Nation/bos-referendum-tally.git
cd bos-referendum-tally
npm install
```

## Quick Start

```bash
npm start
```

## ENV Variables

```env
CHAIN_ID="33cc2426f1b258ef8c798c34c0360b31732ea27a2d7e35a65797850a86d1ba85"
NODEOS_ENDPOINT="https://bostest.eosn.io"
CONTRACT_FORUM="bosforumdapp"
CONTRACT_TOKEN="eosio.token"
TOKEN_SYMBOL="BOS"
```

## Using `eosc forum`

**vote**

```bash
eosc -u https://bos.eosn.io forum vote [voter] [proposal_name] [vote_value] --target-contract bosforumdapp
```

**proposal**

```bash
eosc -u https://bos.eosn.io forum propose [proposer] [proposal_name] [title] [proposal_expiration_date] --target-contract bosforumdapp
```