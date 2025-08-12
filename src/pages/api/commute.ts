import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const address = typeof req.query.address === 'string' ? req.query.address : process.env.WORK_ADDRESS;
  if (!address) {
    return res.status(400).json({ error: 'address is required' });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Google Maps API key' });
  }

  try {
    const geocodeRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
    const geocodeData = await geocodeRes.json();
    const location = geocodeData.results?.[0]?.geometry?.location;
    if (!location) {
      throw new Error('Unable to geocode address');
    }

    const placeRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=1000&type=train_station&key=${apiKey}`
    );
    const placeData = await placeRes.json();
    const stationInfo = placeData.results?.[0];
    if (!stationInfo) {
      throw new Error('No nearby station found');
    }
    const station = stationInfo.name;
    const stationLoc = stationInfo.geometry.location;

    const directionsRes = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${location.lat},${location.lng}&destination=${stationLoc.lat},${stationLoc.lng}&mode=walking&key=${apiKey}`
    );
    const directionsData = await directionsRes.json();
    const durationSec = directionsData.routes?.[0]?.legs?.[0]?.duration?.value || 0;
    const arrivalTime = new Date(Date.now() + durationSec * 1000).toISOString();

    return res.status(200).json({ station, arrivalTime });
  } catch (err) {
    console.error('Commute API error:', err);
    return res.status(500).json({ error: 'Failed to fetch commute info' });
  }
}
