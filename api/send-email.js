export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.choice-press.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { email, message, estimate, bookType, wordCount, manuscriptStatus, selectedPlan, selectedAddons } = req.body;

    const formText = `
    New Book Quote Request:
    
    Email: ${email}
    Book Type: ${bookType}
    Estimated Word Count: ${wordCount}
    Manuscript Status: ${manuscriptStatus}
    Selected Plan: ${selectedPlan}
    Selected Add-ons: ${selectedAddons}
    Estimate: ${estimate}
    
    Message:
    ${message || '(No additional message)'}
    `;    
  
    const auth = Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString("base64");
  
    const response = await fetch("https://api.mailgun.net/v3/mg.choice-press.com/messages", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        from: "Quote Form <form@mg.choice-press.com>",
        to: email,
        bcc: "editorial@choice-press.com",
        subject: "Your Book Quote Estimate",
        text: formText,
      }),
    });
  
    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const err = await response.text();
      return res.status(500).json({ error: err });
    }
  }
  