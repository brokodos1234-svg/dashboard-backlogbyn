import Image from "next/image";

export default function Logo({ size = 34 }: { size?: number }) {
  return (
    <Image
      src="/assets/logo.png"
      alt="BSS"
      width={size * 2.69}
      height={size}
      style={{ height: "auto", width: "auto", maxHeight: size }}
      priority
    />
  );
}
