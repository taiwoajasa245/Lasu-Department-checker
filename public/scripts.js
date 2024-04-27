// Update the department select input based on the selected faculty and level 

document.addEventListener("DOMContentLoaded", function () {
    let level;
    document
      .getElementById("level")
      .addEventListener("change", function () {
        level = this.value;
    });

    document.getElementById("fac").addEventListener("change", function () {
      var selectedFac = this.value;
      // Encode the data in URL-encoded format
      var formData = new URLSearchParams();
      formData.append("fac", selectedFac, "level", level);

      fetch("/api/v1/get-dept", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData, // Use the encoded data
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then((data) => {
          document.getElementById("dept").innerHTML = data;
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    });
});