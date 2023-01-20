import { Company } from "./companies/Company";

export type LogEntry =
  | {
      type: "transaction";
      seller: Company;
      buyer: Company;
    }
  | {
      type: "produced";
      company: Company;
    };

export type Log = LogEntry[];
