import { Building } from "./companies/Building";

export type LogEntry =
  | {
      type: "transaction";
      seller: Building;
      buyer: Building;
    }
  | {
      type: "produced";
      company: Building;
    };

export type Log = LogEntry[];
