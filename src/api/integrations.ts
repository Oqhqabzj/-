// Mocked integrations and clear extension points for real APIs

export async function fetchOrderStatus(orderId: string) {
  await new Promise((r) => setTimeout(r, 450));
  const demoStatuses = ['Packed', 'In transit', 'Out for delivery', 'Delivered'];
  return { orderId, status: demoStatuses[Math.floor(Math.random() * demoStatuses.length)] };
}

export async function fetchProductDetails(name: string) {
  await new Promise((r) => setTimeout(r, 300));
  return { product: name, details: `${name}: available in Black/Blue, warranty 12 months.` };
}

// Placeholder helpers to send/receive messages from platforms
export async function sendToPlatform(platform: string, channelId: string, payload: any) {
  // Implement platform SDK calls here (WhatsApp Cloud API, Messenger, Instagram, etc.)
  console.log('[platform-send]', platform, channelId, payload);
}

export async function receiveFromPlatform(raw: any) {
  // Map platform webhook payload to a normalized message object
  return raw;
}
