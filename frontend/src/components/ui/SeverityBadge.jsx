import { severityTone } from "../../utils/format";
import StatusBadge from "./StatusBadge";

// Renders a badge from the backend severity field.
export default function SeverityBadge({ severity }) {
  return (
    <StatusBadge
      label={severity ?? "UNKNOWN"}
      tone={severityTone(severity)}
    />
  );
}
