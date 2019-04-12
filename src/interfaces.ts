export interface Search {
    block_num: number;
    primary_key: number;
    payer: string;
}

export interface Voters extends Search {
    "@voters": {
        proxy?: string;
        last_vote_weight: number;
        proxied_vote_weight: number;
        staked: number;
        is_proxy: boolean;
    }
}
