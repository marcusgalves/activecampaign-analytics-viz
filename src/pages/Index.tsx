
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CampaignHeader from '@/components/CampaignHeader';
import CampaignStats from '@/components/CampaignStats';
import EngagementChart from '@/components/EngagementChart';
import { Campaign } from '@/types/campaign';

// Sample data from the provided JSON
const sampleCampaignData: Campaign[] = [
  {
    "campaign": {
      "type": "single",
      "userid": "29",
      "segmentid": "4345",
      "bounceid": "-1",
      "realcid": "0",
      "sendid": "952592",
      "threadid": "0",
      "seriesid": "0",
      "formid": "0",
      "basetemplateid": "0",
      "basemessageid": "1998",
      "addressid": "1",
      "source": "copy",
      "name": "DIA DO CONSUMIDOR | PSICOLOGIA DO TRADING | EMAIL 03] [RECENTLY]",
      "cdate": "2025-03-14T17:40:46-05:00",
      "mdate": "2025-03-14T17:42:34-05:00",
      "sdate": "2025-03-15T18:00:00-05:00",
      "ldate": "2025-03-15T18:03:40-05:00",
      "send_amt": "23928",
      "total_amt": "23928",
      "opens": "11271",
      "uniqueopens": "7232",
      "linkclicks": "144",
      "uniquelinkclicks": "99",
      "subscriberclicks": "99",
      "forwards": "0",
      "uniqueforwards": "0",
      "hardbounces": "6",
      "softbounces": "63",
      "unsubscribes": "68",
      "unsubreasons": "23",
      "updates": "0",
      "socialshares": "0",
      "replies": "4",
      "uniquereplies": "4",
      "status": "5",
      "public": "1",
      "mail_transfer": "10",
      "mail_send": "0",
      "mail_cleanup": "1",
      "mailer_log_file": "0",
      "tracklinks": "all",
      "tracklinksanalytics": "1",
      "trackreads": "1",
      "trackreadsanalytics": "1",
      "analytics_campaign_name": "",
      "tweet": "0",
      "facebook": "0",
      "survey": "",
      "embed_images": "0",
      "htmlunsub": "0",
      "textunsub": "0",
      "htmlunsubdata": "",
      "textunsubdata": "",
      "recurring": "day1",
      "willrecur": "0",
      "split_type": "even",
      "split_content": "0",
      "split_offset": "2",
      "split_offset_type": "day",
      "split_winner_messageid": "0",
      "split_winner_awaiting": "0",
      "responder_offset": "0",
      "responder_type": "subscribe",
      "responder_existing": "0",
      "reminder_field": "sdate",
      "reminder_format": "yyyy-mm-dd",
      "reminder_type": "month_day",
      "reminder_offset": "0",
      "reminder_offset_type": "day",
      "reminder_offset_sign": "+",
      "reminder_last_cron_run": null,
      "activerss_interval": "day1",
      "activerss_url": "",
      "activerss_items": "10",
      "ip4": "2978024262",
      "laststep": "designer",
      "managetext": "0",
      "schedule": "1",
      "scheduleddate": null,
      "waitpreview": "0",
      "deletestamp": null,
      "replysys": "1",
      "created_timestamp": "2022-01-25 18:03:05",
      "updated_timestamp": "2025-03-18 17:29:14",
      "created_by": "0",
      "updated_by": "0",
      "ip": "0",
      "series_send_lock_time": "0000-00-00 00:00:00",
      "can_skip_approval": "0",
      "use_quartz_scheduler": "1",
      "verified_opens": "9594",
      "verified_unique_opens": "6355",
      "additional_data": "{\"copiedFrom\":6800,\"summaryEventSent\":true}",
      "predictive_send": "0",
      "repair_timestamp": "2025-03-14 04:06:08",
      "has_outdated_translations": null,
      "moderation_status": "0",
      "segmentname": "",
      "has_predictive_content": "0",
      "message_id": "26128",
      "screenshot": "//hulisses.img-us3.com/_screenshot_/937728e0-576c-4550-a992-57400d11644d.jpeg",
      "campaign_message_id": "6727",
      "ed_version": "2",
      "format": "mime",
      "links": {
        "user": "https://hulisses.api-us1.com/api/3/campaigns/6801/user",
        "automation": "https://hulisses.api-us1.com/api/3/campaigns/6801/automation",
        "campaignMessage": "https://hulisses.api-us1.com/api/3/campaigns/6801/campaignMessage",
        "campaignMessages": "https://hulisses.api-us1.com/api/3/campaigns/6801/campaignMessages",
        "links": "https://hulisses.api-us1.com/api/3/campaigns/6801/links",
        "aggregateRevenues": "https://hulisses.api-us1.com/api/3/campaigns/6801/aggregateRevenues",
        "segment": "https://hulisses.api-us1.com/api/3/campaigns/6801/segment",
        "campaignLists": "https://hulisses.api-us1.com/api/3/campaigns/6801/campaignLists"
      },
      "id": "6801",
      "user": "29",
      "automation": null
    }
  }
];

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    // Simulate API fetch with a delay for animation purposes
    const timer = setTimeout(() => {
      setCampaign(sampleCampaignData[0]);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Loading state with skeleton UI
  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl p-6 h-40">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
          
          <div className="h-80 bg-gray-100 rounded-xl p-6"></div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800">No campaign data available</h2>
        <p className="mt-2 text-gray-600">Please try again later or check your API connection.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <CampaignHeader campaign={campaign.campaign} />
          
          <CampaignStats campaign={campaign.campaign} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EngagementChart campaign={campaign.campaign} />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold mb-4">Campaign Overview</h2>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
                <div className="space-y-4">
                  <div className="flex justify-between pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Campaign Type</span>
                    <span className="font-medium">{campaign.campaign.type.charAt(0).toUpperCase() + campaign.campaign.type.slice(1)}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Recipients</span>
                    <span className="font-medium">{new Intl.NumberFormat().format(parseInt(campaign.campaign.send_amt))}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Unique Opens</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat().format(parseInt(campaign.campaign.uniqueopens))} 
                      <span className="text-xs text-gray-500 ml-1">
                        ({((parseInt(campaign.campaign.uniqueopens) / parseInt(campaign.campaign.send_amt)) * 100).toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Unique Clicks</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat().format(parseInt(campaign.campaign.uniquelinkclicks))}
                      <span className="text-xs text-gray-500 ml-1">
                        ({((parseInt(campaign.campaign.uniquelinkclicks) / parseInt(campaign.campaign.uniqueopens)) * 100).toFixed(1)}% of opens)
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Bounces</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat().format(parseInt(campaign.campaign.hardbounces) + parseInt(campaign.campaign.softbounces))}
                      <span className="text-xs text-gray-500 ml-1">
                        ({((parseInt(campaign.campaign.hardbounces) + parseInt(campaign.campaign.softbounces)) / parseInt(campaign.campaign.send_amt) * 100).toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unsubscribes</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat().format(parseInt(campaign.campaign.unsubscribes))}
                      <span className="text-xs text-gray-500 ml-1">
                        ({((parseInt(campaign.campaign.unsubscribes) / parseInt(campaign.campaign.send_amt)) * 100).toFixed(2)}%)
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
