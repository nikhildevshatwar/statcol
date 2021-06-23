import EdgeAITab from "./EdgeAITab";
import DemoTab from "./DemoTab";

export default function Visualization({ tabSelected }) {
  switch (tabSelected) {
    case "Edge AI":
      return <EdgeAITab />;
    case "Demo":
      return <DemoTab />;
    default:
      return null;
  }
}
