
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
  type: string;
  name: string;
  cdate: string;
  sdate: string | null;
  ldate: string | null;
  screenshot?: string;
  id: string;
  status: string;
  send_amt: string;
  total_amt: string;
  opens: string;
  uniqueopens: string;
  linkclicks: string;
  uniquelinkclicks: string;
  hardbounces: string;
  softbounces: string;
  unsubscribes: string;
  forwards: string;
  uniqueforwards: string;
  replies: string;
  uniquereplies: string;
  socialshares: string;
  trackreads: string;
  tracklinks: string;
  public: string;
  schedule: string;
  segmentid: string;
  formid: string;
  source: string;
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
