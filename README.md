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
CHAIN="bos"
NODEOS_ENDPOINT="https://bos.eosn.io"
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