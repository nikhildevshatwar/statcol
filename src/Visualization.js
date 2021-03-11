import LinuxTab from "./LinuxTab";
import GPUTab from "./GPUTab";

export default function Visualization({ tabSelected }) {
  switch (tabSelected) {
    case "Linux":
      return <LinuxTab />;
    case "GPU":
      return <GPUTab />;
    default:
      return null;
  }
}
