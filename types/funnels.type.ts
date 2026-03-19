export interface FunnelStage {
  id: string;
  name: string;
  description: string;
  order: number;
  type: 'tofu' | 'mofu' | 'bofu';
}

export interface Funnel {
  _id: string;
  name: string;
  description: string;
  type: 'sales' | 'attraction' | 'b2b';
  stages: FunnelStage[];
  createdAt: string;
}