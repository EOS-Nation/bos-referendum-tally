export interface State {
    /**
     * Status of all proposals
     */
    proposals: Proposal[];
    /**
     * Status of all proposals
     */
    tallies: Tallies;
    /**
     * Account Information
     */
    accounts: Accounts;
    /**
     * Proxies Information
     */
    proxies: Accounts;
    /**
     * Status of Votes
     */
    votes: Vote[];
    /**
     * Global Statistics
     */
    global: Global;
}

export interface Voters {
    owner: string;
    proxy: string;
    producers: any[];
    staked: number;
    last_vote_weight: string;
    proxied_vote_weight: string;
    is_proxy: number;
    flags1: number;
    reserved2: number;
    reserved3: string;
}

export interface Vote {
    id: number;
    proposal_name: string;
    voter: string;
    vote: number;
    vote_json: string;
    updated_at: string;
}

export interface Proposal {
    proposal_name: string;
    proposer: string;
    title: string;
    proposal_json: string;
    created_at: string;
    expires_at: string;
}

export interface Delband {
    from: string;
    to: string;
    net_weight: string;
    cpu_weight: string;
}

export interface Userres {
    ram_bytes: number;
    cpu_weight: string;
    net_weight: string;
    owner: string;
}

export interface Tallies {
    /**
     * proposal_name
     */
    [proposal_name: string]: Tally,
}

export interface Tally {
    id: string;
    stats: Stats;
    proposal: Proposal;
}

export interface Stats {
    /**
     * Block Number used for Tally calculations
     */
    block_num: number;
    /**
     * Currency Supply used for Tally calculations
     */
    currency_supply: number;
    /**
     * No less than 15% vote participation among tokens
     */
    vote_participation: boolean;
    /**
     * No fewer than 10% more Yes than No votes (true/false)
     */
    more_yes: boolean;
    /**
     * Sustained for 30 continuous days within a 120 day period. (true/false)
     */
    sustained_days: number;
    /**
     * Total number of votes per account & proxies
     */
    votes: {
        [vote: number]: number
        proxies: number,
        accounts: number,
        total: number,
    };
    /**
     * Accounts Staked
     *
     * Staked weight is calculated using `voter_info.staked` or `self_delegated_bandwidth`
     */
    accounts: {
        [vote: number]: number
        total: number,
    };
    /**
     * Proxies Staked
     *
     * Whenever a proxy votes on a proposal, a sum of each account's staked which have NOT voted for a proposal will counted.
     */
    proxies: {
        [vote: number]: number
        total: number,
    };
    /**
     * Total Staked between both accounts & proxies
     */
    staked: {
        [vote: number]: number
        total: number,
    };
}

export interface ProxiesVote extends Vote {
    staked_proxy: number;
}

export interface Proxies {
    /**
     * Account Information
     */
    [account_name: string]: {
        votes: {
            [proposal_name: string]: ProxiesVote;
        }
        staked: number;
        is_proxy: boolean;
        proxy: string;
    }
}

export interface Accounts {
    /**
     * Account Information
     */
    [account_name: string]: {
        votes: {
            [proposal_name: string]: Vote;
        }
        staked: number;
        is_proxy: boolean;
        proxy: string;
    }
}

export interface Global {
    /**
     * Current EOS supply from `eosio.token`
     *
     * @default "1000000000.0000 EOS"
     */
    supply: string;
    /**
     * Total Activated Staked
     *
     * @default 3774551190700
     */
    total_activated_stake: string;
    /**
     * Current Block Number
     */
    block_num: number;
}

export interface CurrencyStats {
    [symbol: string]: {
        supply:     string;
        max_supply: string;
        issuer:     string;
    }
}