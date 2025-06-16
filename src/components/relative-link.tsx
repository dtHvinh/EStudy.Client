import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RelativeLink({
  href,
  ...props
}: { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const pathName = usePathname();
  return <Link href={`${pathName}/${href.replace(/^\//, "")}`} {...props} />;
}
