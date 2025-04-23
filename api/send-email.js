export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { email, message, estimate } = req.body;
  
    const formText = `
      New Book Quote Request:
  
      Email: ${email}
      Estimate: ${estimate}
      Message: ${message || '(no message)'}
    `;
  
    const auth = Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString("base64");
  
    const response = await fetch("https://api.mailgun.net/v3/YOUR_DOMAIN_NAME/messages", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        from: "Quote Form <form@YOUR_DOMAIN_NAME>",
        to: email,
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
  