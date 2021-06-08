import EdgeAITab from "./EdgeAITab";
import GPUTab from "./GPUTab";

export default function Visualization({ tabSelected }) {
  switch (tabSelected) {
    case "Edge AI":
      return <EdgeAITab />;
    case "GPU":
      return <GPUTab />;
    default:
      return null;
  }
}
