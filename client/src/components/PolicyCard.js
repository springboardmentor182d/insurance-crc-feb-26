import "../styles/styles.css";
import { FaStar, FaHeart, FaCheck } from "react-icons/fa";

function PolicyCard({ policy, compareList, setCompareList }) {

  const toggleCompare = () => {
    if (compareList.find(p => p.id === policy.id)) {
      setCompareList(compareList.filter(p => p.id !== policy.id));
    } else {
      setCompareList([...compareList, policy]);
    }
  };

  const isSelected = compareList.find(p => p.id === policy.id);

  return (
    <div className="card">

      {/* TOP BADGES */}
      <div className="top-badges">
        <div>
          <span className="badge">{policy.category}</span>{" "}
          <span className="badge popular">Popular</span>
        </div>
        <FaHeart color="#ccc" />
      </div>

      {/* TITLE */}
      <h3>{policy.name}</h3>
      <p style={{ color: "gray" }}>{policy.company}</p>

      {/* RATING */}
      <p className="rating">
        <FaStar /> {policy.rating}
      </p>

      {/* PRICE SECTION */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "10px"
      }}>
        <p className="price">₹{policy.price}/month</p>
        <div>
          <p style={{ fontSize: "12px", color: "gray" }}>Coverage</p>
          <b>{policy.coverage}</b>
        </div>
      </div>

      <hr />

      {/* DEDUCTIBLE */}
      <div style={{
        display: "flex",
        justifyContent: "space-between"
      }}>
        <p>Deductible</p>
        <b>₹{policy.deductible}</b>
      </div>

      {/* BENEFITS */}
      <div style={{ marginTop: "10px" }}>
        <p style={{ fontWeight: "bold" }}>Key Benefits</p>

        {(policy.benefits || []).slice(0, 3).map((b, i) => (
          <p key={i} style={{ fontSize: "14px" }}>
            <FaCheck color="green" /> {b}
          </p>
        ))}

        {(policy.benefits || []).length > 3 && (
          <p style={{ color: "#2563eb", fontSize: "13px" }}>
            +{policy.benefits.length - 3} more benefits
          </p>
        )}
      </div>

      {/* BUTTONS */}
      <div className="buttons">
        <button className="btn">View Details</button>

        <button
          className="btn btn-dark"
          onClick={toggleCompare}
          style={{
            marginLeft: "10px",
            background: isSelected ? "red" : "#111"
          }}
        >
          {isSelected ? "Remove" : "Compare"}
        </button>
      </div>

    </div>
  );
}

export default PolicyCard;