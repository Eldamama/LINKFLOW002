async function claim() {

  const res = await fetch("https://xkyynzbbatglctgdtqyu.supabase.co/functions/v1/dynamic-handler", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      session_id: sessionId
    })
  });

  if (res.ok) {

    document.getElementById("linkZone").innerHTML = `
      <input id="victoryLink" placeholder="Coller lien Victory">
      <button onclick="validateLink()">Valider</button>
    `;

  } else {
    alert("180 secondes non validées");
  }
}
