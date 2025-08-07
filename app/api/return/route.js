    // utils/route.js

// Simulated car data (as if fetched from DB)
export const fetchAvailableCars = async () => {
  console.log("✅ Fetching available cars from DB...");
  return [
    {
      id: 101,
      model: 'Toyota Camry',
      type: 'Sedan',
      status: 'Available',
      registrationNumber: 'MH12AB1234',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 102,
      model: 'Honda CR-V',
      type: 'SUV',
      status: 'Available',
      registrationNumber: 'MH12CD5678',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 103,
      model: 'Ford Transit',
      type: 'Van',
      status: 'Available',
      registrationNumber: 'MH12EF9012',
      imageUrl: 'https://via.placeholder.com/150',
    },
  ];
};

// Simulated return post
export const postReturnData = async (data) => {
  console.log("✅ Posting return data to DB...");
  console.log("📦 Data:", data);
  return { status: 200, message: "Return saved successfully" };
};
