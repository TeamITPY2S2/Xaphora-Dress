import React, { useState, useEffect } from "react";

const CardInfoPage = () => {
  const [cards, setCards] = useState([]);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
    saveCardDetails: false,
    userId: localStorage.getItem("userId"), // Get userId from localStorage
  });
  const [editMode, setEditMode] = useState(false);
  const [editCardId, setEditCardId] = useState(null);

  const backendUrl = "http://localhost:8070/api/cardinfo";

  useEffect(() => {
    if (cardData.userId) {
      fetch(`${backendUrl}/user/${cardData.userId}`)
        .then((res) => res.json())
        .then((data) => setCards(data))
        .catch((err) => console.error("Error fetching cards:", err));
    }
  }, [cardData.userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCardData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode && editCardId) {
        // Update existing card
        const res = await fetch(`${backendUrl}/${editCardId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cardData),
        });

        if (res.ok) {
          alert("Card updated successfully!");
          resetForm();
          refreshCards();
        } else {
          alert("Failed to update card");
        }
      } else {
        // Create new card
        const res = await fetch(backendUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cardData),
        });

        if (res.ok) {
          alert("Card saved successfully!");
          resetForm();
          refreshCards();
        } else {
          alert("Failed to save card");
        }
      }
    } catch (error) {
      console.error("Error saving/updating card:", error);
    }
  };

  const handleEdit = (card) => {
    setCardData({
      cardNumber: card.cardNumber,
      cardholderName: card.cardholderName,
      expiryDate: card.expiryDate,
      cvv: card.cvv,
      saveCardDetails: card.saveCardDetails,
      userId: card.userId,
    });
    setEditMode(true);
    setEditCardId(card._id);
  };

  const handleDelete = async (cardId) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;

    try {
      const res = await fetch(`${backendUrl}/${cardId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Card deleted!");
        setCards(cards.filter((card) => card._id !== cardId));
      } else {
        alert("Failed to delete card");
      }
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const resetForm = () => {
    setCardData({
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvv: "",
      saveCardDetails: false,
      userId: cardData.userId,
    });
    setEditMode(false);
    setEditCardId(null);
  };

  const refreshCards = async () => {
    const updatedCards = await fetch(`${backendUrl}/user/${cardData.userId}`).then((res) => res.json());
    setCards(updatedCards);
  };

  // Function to mask card number
  const maskCardNumber = (cardNumber) => {
    return "**** **** **** " + cardNumber.slice(-4);
  };

  return (
    <div className="card-info-page" style={{ padding: "20px" }}>
      <h2>{editMode ? "Edit Card" : "Save Your Card Information"}</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <div>
          <label>Card Number:</label>
          <input
            type="text"
            name="cardNumber"
            value={cardData.cardNumber}
            onChange={handleChange}
            required
            maxLength="16"
            placeholder="Enter 16-digit card number"
          />
        </div>

        <div>
          <label>Cardholder Name:</label>
          <input
            type="text"
            name="cardholderName"
            value={cardData.cardholderName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Expiry Date (MM/YY):</label>
          <input
            type="text"
            name="expiryDate"
            value={cardData.expiryDate}
            onChange={handleChange}
            required
            placeholder="MM/YY"
            maxLength="5"
          />
        </div>

        <div>
          <label>CVV:</label>
          <input
            type="password"
            name="cvv"
            value={cardData.cvv}
            onChange={handleChange}
            required
            maxLength="4"
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="saveCardDetails"
              checked={cardData.saveCardDetails}
              onChange={handleChange}
            />
            Save card for future use
          </label>
        </div>

        <button type="submit">{editMode ? "Update Card" : "Save Card"}</button>
        {editMode && (
          <button type="button" onClick={resetForm} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        )}
      </form>

      <h3>Saved Cards</h3>
      {cards.length === 0 ? (
        <p>No saved cards found.</p>
      ) : (
        <div className="saved-cards-list">
          {cards.map((card) => (
            <div key={card._id} className="card-item" style={{ 
              marginBottom: "20px", 
              padding: "15px", 
              border: "1px solid #ddd", 
              borderRadius: "8px",
              backgroundColor: "#f9f9f9"
            }}>
              <div style={{ marginBottom: "10px" }}>
                <strong>Cardholder:</strong> {card.cardholderName}
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>Card Number:</strong> {maskCardNumber(card.cardNumber)}
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>Expiry Date:</strong> {card.expiryDate}
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  onClick={() => handleEdit(card)}
                  style={{
                    padding: "5px 15px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(card._id)}
                  style={{
                    padding: "5px 15px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardInfoPage;
