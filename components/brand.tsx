import Image from "next/image";

/** Official symbol published in the header of grupojung.com.br. */
export default function Brand() {
  return (
    <span className="brand brand-official">
      <Image
        src="/brand/grupo-jung.jpg"
        width={48}
        height={48}
        alt="Símbolo oficial do Grupo Jung"
        priority
      />
      <span>
        <strong>GRUPO JUNG</strong>
        <small>CONTABILIDADE RURAL</small>
      </span>
    </span>
  );
}
