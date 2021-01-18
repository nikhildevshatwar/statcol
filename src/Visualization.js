import LinuxTab from "./LinuxTab";

export default function Visualization({ tabSelected, ...options }) {
  switch (tabSelected) {
    case "Linux":
      return <LinuxTab {...options} />;
    default:
      return null;
  }
}
