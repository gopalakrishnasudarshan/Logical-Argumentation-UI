export interface Rebuttal {
  id: number;
  targetClaimId: number; // the claim/argument this rebuttal targets
  text: string;
  author: 'Proponent' | 'Opponent' | string;
  createdAt: string; // ISO datetime string
}

export interface CreateRebuttalRequest {
  targetClaimId: number;
  text: string;
  author: 'Proponent' | 'Opponent' | string;
}
