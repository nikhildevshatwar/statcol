import LinuxTab from "./LinuxTab";
import GPUTab from "./GPUTab";

export default function Visualization({ tabSelected, ...options }) {
  switch (tabSelected) {
    case "Linux":
      return <LinuxTab {...options} />;
    case "GPU":
      return <GPUTab {...options} />;
    default:
      return null;
  }
}
