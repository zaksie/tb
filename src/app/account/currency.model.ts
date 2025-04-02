export interface Currency {
  logo_full_url: string;
  logo: string;
  name: string
  code: string
  logo_url: string
  network: string
  fullname: string
}
export interface CurrencyList {
  currencies: Currency[]
  baseUrl: string
}


interface NowPaymentsResponse {
  payment_id: string;
  payment_status: string; // Could be an enum if statuses are fixed (e.g., "waiting", "finished")
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  amount_received: number;
  pay_currency: string;
  order_id: string;
  order_description: string;
  payin_extra_id: string | null;
  ipn_callback_url: string;
  customer_email: string | null;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  purchase_id: string;
  smart_contract: string | null;
  network: string;
  network_precision: number | null;
  time_limit: number | null;
  burning_percent: number | null;
  expiration_estimate_date: string; // ISO 8601 date string
  is_fixed_rate: boolean;
  is_fee_paid_by_user: boolean;
  valid_until: string; // ISO 8601 date string
  type: string; // Could be an enum (e.g., "crypto2crypto")
  product: string; // Could be an enum (e.g., "api")
  origin_ip: string;
}

export interface Order extends NowPaymentsResponse{
}
