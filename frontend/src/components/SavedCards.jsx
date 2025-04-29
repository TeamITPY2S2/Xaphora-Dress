import React, { useState, useEffect } from "react";
import axios from "axios";

const SavedCards = ({ onSelectCard }) => {
  const [savedCards, setSavedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedCards = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:8070/api/cardinfo/user/${userId}`);
        setSavedCards(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch saved cards");
        setLoading(false);
        console.error("Error fetching saved cards:", err);
      }
    };

    fetchSavedCards();
  }, []);

  const maskCardNumber = (cardNumber) => {
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };

  const handleSelectCard = (card) => {
    if (onSelectCard) {
      onSelectCard(card);
    }
  };

  if (loading) {
    return <div>Loading saved cards...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (savedCards.length === 0) {
    return <div>No saved cards found</div>;
  }

  return (
    <div className="saved-cards">
      <h3>Saved Cards</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {savedCards.map((card) => (
          <div
            key={card._id}
            onClick={() => handleSelectCard(card)}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: "#f9f9f9"
            }}
          >
            <div>{maskCardNumber(card.cardNumber)}</div>
            <div>Expires: {card.expiryDate}</div>
            <div>{card.cardholderName}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedCards; 