// Adjust coordinates and font sizes to match your template (landscape)
export const positionText = (field) => {
  switch (field) {
    case "name":
      return {
        position: "absolute",
        top: 220,
        left: 330,
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
      };
    case "event":
      return {
        position: "absolute",
        top: 320,
        left: 430,
        fontSize: 18,
        color: "#333",
      };
    default:
      return {};
  }
};
