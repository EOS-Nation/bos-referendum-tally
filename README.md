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
# Configuration
NODEOS_ENDPOINT="https://bostest.eosn.io"
CONTRACT_FORUM="bosforumdapp"
CONTRACT_TOKEN="eosio.token"
TOKEN_SYMBOL="BOS"

# AWS Config
AWS_BUCKET="bostest.referendum"
AWS_ACCESS_KEY_ID="<ACCESS KEY>"
AWS_SECRET_ACCESS_KEY="<SECRET KEY>"
AWS_REGION="us-east-1"

# Debug Config
DELAY_MS=10
DEBUG=false
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