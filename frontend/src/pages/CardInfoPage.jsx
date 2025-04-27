import React, { useState, useEffect } from "react";

const CardInfoPage = () => {
  const [cards, setCards] = useState([]);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
    saveCardDetails: false,
    userId: "6621234567890abcdef1234", // <-- Replace with real user ID
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
        <ul>
          {cards.map((card) => (
            <li key={card._id} style={{ marginBottom: "10px" }}>
              <strong>{card.cardholderName}</strong> - **** **** **** {card.cardNumber.slice(-4)}<br />
              Expiry: {card.expiryDate}
              <br />
              <button onClick={() => handleEdit(card)} style={{ marginTop: "5px", marginRight: "5px" }}>
                Edit
              </button>
              <button onClick={() => handleDelete(card._id)} style={{ marginTop: "5px" }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CardInfoPage;
