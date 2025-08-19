// @note api route to proxy ai requests and handle cors
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'invalid messages format' });
    }

    // @note call the external ai api
    const response = await fetch(
      'https://aibo-backend.yuv.workers.dev/api/ai',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`ai api error: ${response.status}`);
    }

    const data = await response.json();

    // @note return the ai response
    res.status(200).json(data);
  } catch (error) {
    console.error('ai api error:', error);
    res.status(500).json({
      error: 'failed to process ai request',
      message: 'maaf, terjadi kesalahan. silakan coba lagi.',
    });
  }
}
