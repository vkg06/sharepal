export default function Orders({ data }) {
  return (
    <section className="orders">
      <h2>{data.heading} <span>{data.highlighted}</span></h2>
      <p>{data.text}</p>
    </section>
  );
}
