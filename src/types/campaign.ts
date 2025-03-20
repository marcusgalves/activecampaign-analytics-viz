
export interface Campaign {
  campaign: {
    type: string;
    name: string;
    cdate: string;
    sdate: string;
    ldate: string;
    send_amt: string;
    total_amt: string;
    opens: string;
    uniqueopens: string;
    linkclicks: string;
    uniquelinkclicks: string;
    subscriberclicks: string;
    forwards: string;
    uniqueforwards: string;
    hardbounces: string;
    softbounces: string;
    unsubscribes: string;
    unsubreasons: string;
    updates: string;
    socialshares: string;
    replies: string;
    uniquereplies: string;
    status: string;
    screenshot?: string;
    id: string;
    tracklinks: string;
    trackreads: string;
    public: string;
    schedule: string;
    segmentid: string;
    formid: string;
    source: string;
    [key: string]: any;
  };
}

export interface CampaignItem {
  id: number;
  name: string;
  type: string;
  source: string;
  cdate: string;
  mdate: string | null;
  sdate: string | null;
  ldate: string | null;
  created_timestamp: string;
  updated_timestamp: string;
  status: number;
  public: boolean;
  formid: number;
  segmentid: number;
  has_automation: boolean | null;
  tags: string | null;
  last_synced: string;
  active: boolean;
  screenshot?: string;
  // Campos adicionais para compatibilidade com o código existente
  send_amt?: string;
  total_amt?: string;
  opens?: string;
  uniqueopens?: string;
  linkclicks?: string;
  uniquelinkclicks?: string;
  hardbounces?: string;
  softbounces?: string;
  unsubscribes?: string;
  forwards?: string;
  uniqueforwards?: string;
  replies?: string;
  uniquereplies?: string;
  socialshares?: string;
  trackreads?: string;
  tracklinks?: string;
  schedule?: string;
  [key: string]: any;
}

export interface CampaignStat {
  label: string;
  value: number | string;
  percentage?: number;
  previousValue?: number;
  change?: number;
  positive?: boolean;
  icon?: string;
  helpText?: string;
}

export interface ChartData {
  name: string;
  value: number;
  percentage?: number;
  color?: string;
}
