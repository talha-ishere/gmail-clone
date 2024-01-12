import "./Content.css";

function Content({ children }) {
  return (
    <>
      <div className="container">{children}</div>
    </>
  );
}

export default Content;
