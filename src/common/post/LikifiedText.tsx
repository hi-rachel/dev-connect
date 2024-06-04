import { linkify } from "../../utils/linkify";

interface LinkifiedTextProps {
  text: string;
}

const LinkifiedText: React.FC<LinkifiedTextProps> = ({ text }) => {
  return <span>{linkify(text)}</span>;
};

export default LinkifiedText;
