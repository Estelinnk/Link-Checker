import services from '../../data/services.json';

export default async function handler(req, res) {
  const results = await Promise.all(
    services.map(async (service) => {
      try {
        const response = await fetch(service.url, { method: 'HEAD' });
        return {
          name: service.name,
          url: service.url,
          status: response.status,
          up: response.ok,
        };
      } catch {
        return {
          name: service.name,
          url: service.url,
          status: null,
          up: false,
        };
      }
    })
  );

  res.status(200).json({ services: results });
}
