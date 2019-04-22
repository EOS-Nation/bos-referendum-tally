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